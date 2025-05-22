
import { execute } from '../config/db.js';
import MessageModel from '../models/messageModel.js';

// Get direct messages between current user and contact
export async function getDirectMessages(req, res) {
  try {
    const userId = req.user.id;
    const contactId = req.params.contactId;
    
    const messages = await MessageModel.getDirectMessages(userId, contactId);
    
    // Mark messages as read
    await MessageModel.markMessagesAsRead(userId, contactId);
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching direct messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
}

// Get recent chats for the current user
export async function getRecentChats(req, res) {
  try {
    const userId = req.user.id;
    const chats = await MessageModel.getRecentChats(userId);
    res.json(chats);
  } catch (error) {
    console.error('Error fetching recent chats:', error);
    res.status(500).json({ message: 'Failed to fetch recent chats' });
  }
}

// Send a direct message
export async function sendMessage(req, res) {
  try {
    const { receiver_id, content, has_attachment, attachment_url } = req.body;
    
    if (!receiver_id || !content) {
      return res.status(400).json({ message: 'Receiver ID and content are required' });
    }
    
    const messageId = await MessageModel.createMessage({
      sender_id: req.user.id,
      receiver_id,
      content,
      has_attachment: has_attachment || false,
      attachment_url
    });
    
    const message = await MessageModel.getMessageById(messageId);
    
    // Send real-time notification via socket if needed
    if (req.io) {
      req.io.to(`user_${receiver_id}`).emit('new_message', message);
    }
    
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
}

// Create a new message group
export async function createGroup(req, res) {
  try {
    const { name, description, members } = req.body;
    
    if (!name || !members || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ message: 'Group name and at least one member are required' });
    }
    
    // Create the group
    const groupId = await MessageModel.createGroup({
      name,
      description,
      created_by: req.user.id
    });
    
    // Add the creator as admin
    await MessageModel.addMemberToGroup({
      group_id: groupId,
      user_id: req.user.id,
      is_admin: true
    });
    
    // Add other members
    for (const memberId of members) {
      if (memberId !== req.user.id) {
        await MessageModel.addMemberToGroup({
          group_id: groupId,
          user_id: memberId,
          is_admin: false
        });
      }
    }
    
    const group = await MessageModel.getGroupById(groupId);
    
    res.status(201).json(group);
  } catch (error) {
    console.error('Error creating message group:', error);
    res.status(500).json({ message: 'Failed to create group' });
  }
}

// Get groups for the current user
export async function getUserGroups(req, res) {
  try {
    const userId = req.user.id;
    const groups = await MessageModel.getUserGroups(userId);
    res.json(groups);
  } catch (error) {
    console.error('Error fetching user groups:', error);
    res.status(500).json({ message: 'Failed to fetch groups' });
  }
}

// Get messages for a specific group
export async function getGroupMessages(req, res) {
  try {
    const userId = req.user.id;
    const groupId = req.params.groupId;
    
    // Check if user is a member of the group
    const isMember = await MessageModel.isGroupMember(groupId, userId);
    if (!isMember) {
      return res.status(403).json({ message: 'Not a member of this group' });
    }
    
    const messages = await MessageModel.getGroupMessages(groupId);
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching group messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
}

// Send a message to a group
export async function sendGroupMessage(req, res) {
  try {
    const { group_id, content, has_attachment, attachment_url } = req.body;
    
    if (!group_id || !content) {
      return res.status(400).json({ message: 'Group ID and content are required' });
    }
    
    // Check if user is a member of the group
    const isMember = await MessageModel.isGroupMember(group_id, req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: 'Not a member of this group' });
    }
    
    const messageId = await MessageModel.createGroupMessage({
      sender_id: req.user.id,
      group_id,
      content,
      has_attachment: has_attachment || false,
      attachment_url
    });
    
    const message = await MessageModel.getMessageById(messageId);
    
    // Send real-time notification via socket if needed
    if (req.io) {
      req.io.to(`group_${group_id}`).emit('new_group_message', message);
    }
    
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending group message:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
}

// Add a user to a group
export async function addToGroup(req, res) {
  try {
    const { group_id, user_id, is_admin } = req.body;
    
    if (!group_id || !user_id) {
      return res.status(400).json({ message: 'Group ID and user ID are required' });
    }
    
    // Check if requester is an admin of the group
    const isAdmin = await MessageModel.isGroupAdmin(group_id, req.user.id);
    if (!isAdmin) {
      return res.status(403).json({ message: 'Only group admins can add new members' });
    }
    
    await MessageModel.addMemberToGroup({
      group_id,
      user_id,
      is_admin: is_admin || false
    });
    
    res.json({ message: 'User added to the group successfully' });
  } catch (error) {
    console.error('Error adding user to group:', error);
    res.status(500).json({ message: 'Failed to add user to the group' });
  }
}

// Remove a user from a group
export async function removeFromGroup(req, res) {
  try {
    const groupId = req.params.groupId;
    const userId = req.params.userId;
    
    // Check if requester is an admin or the user being removed is themselves
    const isAdmin = await MessageModel.isGroupAdmin(groupId, req.user.id);
    if (!isAdmin && req.user.id !== parseInt(userId)) {
      return res.status(403).json({ message: 'Only group admins can remove other members' });
    }
    
    await MessageModel.removeMemberFromGroup(groupId, userId);
    
    res.json({ message: 'User removed from the group' });
  } catch (error) {
    console.error('Error removing user from group:', error);
    res.status(500).json({ message: 'Failed to remove user from the group' });
  }
}

// Get group members
export async function getGroupMembers(req, res) {
  try {
    const groupId = req.params.groupId;
    const userId = req.user.id;
    
    // Check if user is a member of the group
    const isMember = await MessageModel.isGroupMember(groupId, userId);
    if (!isMember) {
      return res.status(403).json({ message: 'Not a member of this group' });
    }
    
    const members = await MessageModel.getGroupMembers(groupId);
    
    res.json(members);
  } catch (error) {
    console.error('Error fetching group members:', error);
    res.status(500).json({ message: 'Failed to fetch group members' });
  }
}

// Search for users to message
export async function searchUsers(req, res) {
  try {
    const query = req.params.query;
    const currentUserId = req.user.id;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }
    
    const users = await MessageModel.searchUsers(query, currentUserId);
    
    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Failed to search users' });
  }
}

// Initiate direct message from job application or contact
export async function initiateDirectMessage(req, res) {
  try {
    const { recipient_id, initial_message } = req.body;
    
    if (!recipient_id) {
      return res.status(400).json({ message: 'Recipient ID is required' });
    }
    
    // Create the message if initial message is provided
    if (initial_message) {
      await MessageModel.createMessage({
        sender_id: req.user.id,
        receiver_id: recipient_id,
        content: initial_message
      });
    }
    
    // Return the recipient info to open chat
    const recipient = await execute(
      'SELECT id, name, email, avatar FROM users WHERE id = ?',
      [recipient_id]
    );
    
    res.json({
      success: true,
      recipient: recipient[0] || recipient.rows?.[0],
      message: 'Chat initiated successfully'
    });
  } catch (error) {
    console.error('Error initiating direct message:', error);
    res.status(500).json({ message: 'Failed to initiate chat' });
  }
}
