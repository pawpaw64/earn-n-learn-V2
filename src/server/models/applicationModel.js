
import { execute } from "../config/db.js";

class ApplicationModel {
  // Unified method to handle query results
  static async #handleQueryResult(result) {
    // Handle cases where result is already the rows array
    if (Array.isArray(result)) {
      return result;
    }

    // Handle cases where result is an object with rows/first result set at index 0
    if (result && Array.isArray(result[0])) {
      return result[0];
    }

    // Handle cases where result is [rows, fields] array
    if (
      Array.isArray(result) &&
      result.length === 2 &&
      Array.isArray(result[0])
    ) {
      return result[0];
    }

    console.error("Unexpected query result format:", result);
    return [];
  }

  // Create new application with additional fields
  static async create(applicationData) {
    // Validate input
    if (!applicationData || typeof applicationData !== "object") {
      throw new Error("Invalid application data");
    }

    const { job_id, user_id, cover_letter, phone, resume_url } = applicationData;

    // Validate required fields
    if (!job_id || !user_id || !cover_letter) {
      throw new Error("Missing required application fields");
    }

    try {
      const result = await execute(
        "INSERT INTO applications (job_id, user_id, cover_letter, phone, resume_url) VALUES (?, ?, ?, ?, ?)",
        [job_id, user_id, cover_letter, phone || null, resume_url || null]
      );

      // Handle different result formats
      const insertId = Array.isArray(result)
        ? result[0]?.insertId || result.insertId
        : result.insertId;

      return insertId;
    } catch (error) {
      console.error("ApplicationModel.create() - Error:", error);
      throw error;
    }
  }

  // Get application by ID with all details
  static async getById(id) {
    try {
      const result = await execute(
        `
      SELECT 
        a.*, 
        j.title as job_title, 
        j.user_id as poster_id, 
        j.type as job_type, 
        j.description as job_description,
        j.payment, j.deadline, j.requirements, j.location,
        u.name as applicant_name, 
        u.email as applicant_email, 
        u.avatar as applicant_avatar,
        p.name as poster_name, 
        p.email as poster_email, 
        p.avatar as poster_avatar
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON a.user_id = u.id
      JOIN users p ON j.user_id = p.id
      WHERE a.id = ?
    `,
        [id]
      );
      
      const rows = Array.isArray(result) ? result : result.rows || [];
      return rows[0];
    } catch (error) {
      console.error("ApplicationModel.getById() - Error:", error);
      throw error;
    }
  }

  // Get applications by user ID (applicant) with additional fields
  static async getByUserId(userId) {
    try {
      const result = await execute(
        `
      SELECT a.*, j.title, j.type, j.payment, j.deadline, j.location,
      u.name as poster_name, u.email as poster_email
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON j.user_id = u.id
      WHERE a.user_id = ?
      ORDER BY a.created_at DESC
    `,
        [userId]
      );

      return this.#handleQueryResult(result);
    } catch (error) {
      console.error("ApplicationModel.getByUserId() - Error", {
        userId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  // Get applications for user's jobs with additional fields
  static async getToUserJobs(userId) {
    try {
      const result = await execute(
        `
      SELECT a.*, j.title, j.type, j.payment,
      u.name as applicant_name, u.email as applicant_email, u.avatar as applicant_avatar
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON a.user_id = u.id
      WHERE j.user_id = ?
      ORDER BY a.created_at DESC
    `,
        [userId]
      );

      return this.#handleQueryResult(result);
    } catch (error) {
      console.error("ApplicationModel.getToUserJobs() - Error", {
        userId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  // Get applications by job ID with full applicant details
  static async getByJobId(jobId) {
    try {
      const result = await execute(`
      SELECT 
        a.*, 
        u.name as applicant_name, 
        u.email as applicant_email, 
        u.avatar as applicant_avatar,
        u.bio as applicant_bio,
        u.university as applicant_university,
        j.title as job_title
      FROM applications a
      JOIN users u ON a.user_id = u.id
      JOIN jobs j ON a.job_id = j.id
      WHERE a.job_id = ?
      ORDER BY a.created_at DESC
    `, [jobId]);

      return this.#handleQueryResult(result);
    } catch (error) {
      console.error("ApplicationModel.getByJobId() - Error", {
        jobId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  // Update application status
  static async updateStatus(id, status) {
    try {
      const result = await execute(
        "UPDATE applications SET status = ? WHERE id = ?",
        [status, id]
      );

      // Handle different result formats from database
      const affectedRows = Array.isArray(result)
        ? result[0]?.affectedRows || result.affectedRows
        : result.affectedRows;

      return affectedRows;
    } catch (error) {
      console.error("ApplicationModel.updateStatus() - Error:", {
        id,
        status,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  // Check if user has already applied for a job
  static async checkDuplicate(jobId, userId) {
    try {
      const result = await execute(
        "SELECT id FROM applications WHERE job_id = ? AND user_id = ?",
        [jobId, userId]
      );
      return this.#handleQueryResult(result);
    } catch (error) {
      console.error("ApplicationModel.checkDuplicate() - Error:", error);
      throw error;
    }
  }

  // Get accepted applications by job ID
  static async getAcceptedByJobId(jobId) {
    try {
      const result = await execute(
        "SELECT * FROM applications WHERE job_id = ? AND status = 'Accepted'",
        [jobId]
      );
      return this.#handleQueryResult(result);
    } catch (error) {
      console.error("ApplicationModel.getAcceptedByJobId() - Error:", error);
      throw error;
    }
  }

  // Get all applications (admin only)
  static async getAll() {
    try {
      const result = await execute(`
      SELECT a.*, j.title as job_title, j.type as job_type, 
      u.name as applicant_name, u.email as applicant_email,
      p.name as poster_name, p.email as poster_email
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON a.user_id = u.id
      JOIN users p ON j.user_id = p.id
      ORDER BY a.created_at DESC
    `);
      return this.#handleQueryResult(result);
    } catch (error) {
      console.error("ApplicationModel.getAll() - Error:", error);
      throw error;
    }
  }
  // Update escrow status for an application
  static async updateEscrowStatus(id, status) {
    try {
      const result = await execute(
        "UPDATE applications SET escrow_status = ? WHERE id = ?",
        [status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error updating escrow status:", error);
      throw error;
    }
  }

  // Update project ID for an application
  static async updateProjectId(id, projectId) {
    try {
      const result = await execute(
        "UPDATE applications SET project_id = ? WHERE id = ?",
        [projectId, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error updating project ID:", error);
      throw error;
    }
  }
}

export default ApplicationModel;
