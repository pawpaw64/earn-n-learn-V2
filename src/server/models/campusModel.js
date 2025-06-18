
import db from '../config/db.js';

class CampusModel {
  // Create a new post
  static async createPost(postData) {
    try {
      const { user_id, type, title, content, tags, privacy, attachment_url, attachment_type } = postData;
      
      const [result] = await db.query(
        `INSERT INTO campus_posts (user_id, type, title, content, tags, privacy, attachment_url, attachment_type) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_id, type, title, content, JSON.stringify(tags || []), privacy || 'public', attachment_url, attachment_type]
      );
      
      // Update tag counts
      if (tags && tags.length > 0) {
        await this.updateTagCounts(tags);
      }
      
      return result.insertId;
    } catch (error) {
      console.error('Error in createPost:', error);
      throw error;
    }
  }

  // Get posts with filters
  static async getPosts(filters = {}) {
    try {
      const { type, tags, sortBy = 'recent', limit = 20, offset = 0, userId } = filters;
      
      let query = `
        SELECT p.*, u.name as author_name, u.avatar as author_avatar,
               (SELECT COUNT(*) FROM campus_post_likes pl WHERE pl.post_id = p.id AND pl.user_id = ?) as is_liked
        FROM campus_posts p
        JOIN users u ON p.user_id = u.id
        WHERE 1=1
      `;
      const params = [userId || 0];
      
      if (type) {
        query += ' AND p.type = ?';
        params.push(type);
      }
      
      if (tags && tags.length > 0) {
        query += ' AND JSON_OVERLAPS(p.tags, ?)';
        params.push(JSON.stringify(tags));
      }
      
      // Sorting
      switch (sortBy) {
        case 'popular':
          query += ' ORDER BY (p.likes_count + p.comments_count) DESC, p.created_at DESC';
          break;
        case 'trending':
          query += ' ORDER BY (p.likes_count + p.comments_count) / TIMESTAMPDIFF(HOUR, p.created_at, NOW()) DESC';
          break;
        case 'unanswered':
          query += ' AND p.type = "question" AND p.is_solved = FALSE ORDER BY p.created_at DESC';
          break;
        default:
          query += ' ORDER BY p.created_at DESC';
      }
      
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
      
      const [rows] = await db.query(query, params);
      
      // Parse tags JSON
      return rows.map(post => ({
        ...post,
        tags: JSON.parse(post.tags || '[]'),
        is_liked: post.is_liked > 0
      }));
    } catch (error) {
      console.error('Error in getPosts:', error);
      throw error;
    }
  }

  // Get post by ID
  static async getPostById(postId, userId) {
    try {
      const [rows] = await db.query(
        `SELECT p.*, u.name as author_name, u.avatar as author_avatar,
                (SELECT COUNT(*) FROM campus_post_likes pl WHERE pl.post_id = p.id AND pl.user_id = ?) as is_liked
         FROM campus_posts p
         JOIN users u ON p.user_id = u.id
         WHERE p.id = ?`,
        [userId || 0, postId]
      );
      
      if (rows.length === 0) return null;
      
      const post = {
        ...rows[0],
        tags: JSON.parse(rows[0].tags || '[]'),
        is_liked: rows[0].is_liked > 0
      };
      
      // Increment view count
      await db.query('UPDATE campus_posts SET views_count = views_count + 1 WHERE id = ?', [postId]);
      
      return post;
    } catch (error) {
      console.error('Error in getPostById:', error);
      throw error;
    }
  }

  // Create a comment
  static async createComment(commentData) {
    try {
      const { post_id, user_id, parent_id, content } = commentData;
      
      const [result] = await db.query(
        'INSERT INTO campus_comments (post_id, user_id, parent_id, content) VALUES (?, ?, ?, ?)',
        [post_id, user_id, parent_id, content]
      );
      
      // Update post comment count
      await db.query('UPDATE campus_posts SET comments_count = comments_count + 1 WHERE id = ?', [post_id]);
      
      return result.insertId;
    } catch (error) {
      console.error('Error in createComment:', error);
      throw error;
    }
  }

  // Get comments for a post
  static async getCommentsByPostId(postId, userId) {
    try {
      const [rows] = await db.query(
        `SELECT c.*, u.name as author_name, u.avatar as author_avatar,
                (SELECT COUNT(*) FROM campus_comment_likes cl WHERE cl.comment_id = c.id AND cl.user_id = ?) as is_liked
         FROM campus_comments c
         JOIN users u ON c.user_id = u.id
         WHERE c.post_id = ?
         ORDER BY c.created_at ASC`,
        [userId || 0, postId]
      );
      
      return rows.map(comment => ({
        ...comment,
        is_liked: comment.is_liked > 0
      }));
    } catch (error) {
      console.error('Error in getCommentsByPostId:', error);
      throw error;
    }
  }

  // Like/unlike post
  static async togglePostLike(postId, userId) {
    try {
      const [existing] = await db.query(
        'SELECT id FROM campus_post_likes WHERE post_id = ? AND user_id = ?',
        [postId, userId]
      );
      
      if (existing.length > 0) {
        // Unlike
        await db.query('DELETE FROM campus_post_likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
        await db.query('UPDATE campus_posts SET likes_count = likes_count - 1 WHERE id = ?', [postId]);
        return false;
      } else {
        // Like
        await db.query('INSERT INTO campus_post_likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);
        await db.query('UPDATE campus_posts SET likes_count = likes_count + 1 WHERE id = ?', [postId]);
        return true;
      }
    } catch (error) {
      console.error('Error in togglePostLike:', error);
      throw error;
    }
  }

  // Like/unlike comment
  static async toggleCommentLike(commentId, userId) {
    try {
      const [existing] = await db.query(
        'SELECT id FROM campus_comment_likes WHERE comment_id = ? AND user_id = ?',
        [commentId, userId]
      );
      
      if (existing.length > 0) {
        // Unlike
        await db.query('DELETE FROM campus_comment_likes WHERE comment_id = ? AND user_id = ?', [commentId, userId]);
        await db.query('UPDATE campus_comments SET likes_count = likes_count - 1 WHERE id = ?', [commentId]);
        return false;
      } else {
        // Like
        await db.query('INSERT INTO campus_comment_likes (comment_id, user_id) VALUES (?, ?)', [commentId, userId]);
        await db.query('UPDATE campus_comments SET likes_count = likes_count + 1 WHERE id = ?', [commentId]);
        return true;
      }
    } catch (error) {
      console.error('Error in toggleCommentLike:', error);
      throw error;
    }
  }

  // Get or create tags
  static async getOrCreateTags(tagNames) {
    try {
      const tags = [];
      
      for (const tagName of tagNames) {
        const [existing] = await db.query('SELECT * FROM campus_tags WHERE name = ?', [tagName]);
        
        if (existing.length > 0) {
          tags.push(existing[0]);
        } else {
          const [result] = await db.query(
            'INSERT INTO campus_tags (name, category) VALUES (?, ?)',
            [tagName, 'general']
          );
          tags.push({ id: result.insertId, name: tagName, category: 'general' });
        }
      }
      
      return tags;
    } catch (error) {
      console.error('Error in getOrCreateTags:', error);
      throw error;
    }
  }

  // Update tag counts
  static async updateTagCounts(tagNames) {
    try {
      for (const tagName of tagNames) {
        await db.query(
          'UPDATE campus_tags SET posts_count = posts_count + 1 WHERE name = ?',
          [tagName]
        );
      }
    } catch (error) {
      console.error('Error in updateTagCounts:', error);
      throw error;
    }
  }

  // Search posts
  static async searchPosts(query, filters = {}) {
    try {
      const { type, tags, dateRange, sortBy = 'relevance', limit = 20, offset = 0, userId } = filters;
      
      let searchQuery = `
        SELECT p.*, u.name as author_name, u.avatar as author_avatar,
               (SELECT COUNT(*) FROM campus_post_likes pl WHERE pl.post_id = p.id AND pl.user_id = ?) as is_liked,
               MATCH(p.title, p.content) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance_score
        FROM campus_posts p
        JOIN users u ON p.user_id = u.id
        WHERE MATCH(p.title, p.content) AGAINST(? IN NATURAL LANGUAGE MODE)
      `;
      const params = [userId || 0, query, query];
      
      if (type) {
        searchQuery += ' AND p.type = ?';
        params.push(type);
      }
      
      if (tags && tags.length > 0) {
        searchQuery += ' AND JSON_OVERLAPS(p.tags, ?)';
        params.push(JSON.stringify(tags));
      }
      
      if (dateRange) {
        searchQuery += ' AND p.created_at >= ?';
        params.push(dateRange);
      }
      
      // Sorting
      switch (sortBy) {
        case 'popular':
          searchQuery += ' ORDER BY (p.likes_count + p.comments_count) DESC, relevance_score DESC';
          break;
        case 'recent':
          searchQuery += ' ORDER BY p.created_at DESC';
          break;
        default:
          searchQuery += ' ORDER BY relevance_score DESC, p.created_at DESC';
      }
      
      searchQuery += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
      
      const [rows] = await db.query(searchQuery, params);
      
      return rows.map(post => ({
        ...post,
        tags: JSON.parse(post.tags || '[]'),
        is_liked: post.is_liked > 0
      }));
    } catch (error) {
      console.error('Error in searchPosts:', error);
      throw error;
    }
  }
}

export default CampusModel;
