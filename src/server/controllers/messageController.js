import MessageModel from '../models/messageModel.js';

// Get direct messages between two users
export const getDirectMessages = async (req, res) => {
  try {
    const { contactId } = req.params;
      console.log('getDirectMessages controller - user:', req.user, 'contactId:', contactId);
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const messages = await MessageModel.getDirectMessages(req.user.id, contactId);
    
    // Mark messages as read
    await MessageModel.markAsRead(contactId, req.user.id);
    
    res.json(messages);
  } catch (error) {
    console.error('Error in getDirectMessages controller:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

// Get recent chats
export const getRecentChats = async (req, res) => {
  try {
    const chats = await MessageModel.getRecentChats(req.user.id);
    res.json(chats);
  } catch (error) {
    console.error('Error in getRecentChats controller:', error);
    res.status(500).json({ message: 'Failed to fetch recent chats' });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, hasAttachment, attachmentUrl } = req.body;
    console.log('sendMessage controller - user:', req.user, 'receiverId:', receiverId);
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // 1. Send the message
    const message = await MessageModel.sendMessage(
      req.user.id,
      receiverId,
      content,
      hasAttachment || false,
      attachmentUrl || null
    );

    // 2. Create notification for the receiver
    try {
      const sender = await UserModel.getById(req.user.id); // Get sender details
      
      await NotificationModel.create({
        user_id: receiverId,
        title: "New Message",
        message: `You have a new message from ${sender.name}`,
        type: "message",
        reference_id: message.id,
        reference_type: "direct_message"
      });
      
      console.log(`Notification created for new message to user ${receiverId}`);
    } catch (notificationError) {
      console.error("Error creating message notification:", notificationError);
      // Don't fail the message send if notification fails
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Error in sendMessage controller:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

// Create a group
export const createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const groupId = await MessageModel.createGroup(name, description, req.user.id);
    
    res.status(201).json({ 
      id: groupId,
      name,
      description,
      created_by: req.user.id
    });
  } catch (error) {
    console.error('Error in createGroup controller:', error);
    res.status(500).json({ message: 'Failed to create group' });
  }
};

// Get user groups
export const getUserGroups = async (req, res) => {
  try {
    const groups = await MessageModel.getUserGroups(req.user.id);
    res.json(groups);
  } catch (error) {
    console.error('Error in getUserGroups controller:', error);
    res.status(500).json({ message: 'Failed to fetch groups' });
  }
};

// Get group messages
export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
     console.log('getGroupMessages controller - user:', req.user, 'groupId:', groupId);
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const messages = await MessageModel.getGroupMessages(groupId);
    res.json(messages);
  } catch (error) {
    console.error('Error in getGroupMessages controller:', error);
    res.status(500).json({ message: 'Failed to fetch group messages' });
  }
};

// Send group message
export const sendGroupMessage = async (req, res) => {
  try {
    const { groupId, content, hasAttachment, attachmentUrl } = req.body;
    console.log('sendGroupMessage controller - user:', req.user, 'groupId:', groupId);
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // 1. Send the group message
    const message = await MessageModel.sendGroupMessage(
      req.user.id,
      groupId,
      content,
      hasAttachment || false,
      attachmentUrl || null
    );

    // 2. Get all group members except sender
    const members = await MessageModel.getGroupMembers(groupId);
    const membersToNotify = members.filter(member => member.user_id !== req.user.id);

    // 3. Create notifications for each member
    try {
      const sender = await UserModel.getById(req.user.id);
      const group = await MessageModel.getGroupById(groupId);
      
      await Promise.all(membersToNotify.map(async (member) => {
        await NotificationModel.create({
          user_id: member.user_id,
          title: "New Group Message",
          message: `New message in ${group.name} from ${sender.name}`,
          type: "group_message",
          reference_id: message.id,
          reference_type: "group_message"
        });
      }));
      
      console.log(`Notifications created for ${membersToNotify.length} group members`);
    } catch (notificationError) {
      console.error("Error creating group message notifications:", notificationError);
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Error in sendGroupMessage controller:', error);
    res.status(500).json({ message: 'Failed to send group message' });
  }
};

// Add user to group
export const addToGroup = async (req, res) => {
  try {
    const { groupId, userId, isAdmin } = req.body;
    
    await MessageModel.addToGroup(groupId, userId, isAdmin || false);
    
    res.status(200).json({ message: 'User added to group successfully' });
  } catch (error) {
    console.error('Error in addToGroup controller:', error);
    res.status(500).json({ message: 'Failed to add user to group' });
  }
};

// Remove user from group
export const removeFromGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    
    await MessageModel.removeFromGroup(groupId, userId);
    
    res.status(200).json({ message: 'User removed from group successfully' });
  } catch (error) {
    console.error('Error in removeFromGroup controller:', error);
    res.status(500).json({ message: 'Failed to remove user from group' });
  }
};

// Get group members
export const getGroupMembers = async (req, res) => {
  try {
    const { groupId } = req.params;
    
    const members = await MessageModel.getGroupMembers(groupId);
    
    res.json(members);
  } catch (error) {
    console.error('Error in getGroupMembers controller:', error);
    res.status(500).json({ message: 'Failed to fetch group members' });
  }
};

// Search for users
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.params;
    
    const users = await MessageModel.searchUsers(query, req.user.id);
    
    res.json(users);
  } catch (error) {
    console.error('Error in searchUsers controller:', error);
    res.status(500).json({ message: 'Failed to search users' });
  }
};

// Find group by name pattern
export const findGroupByName = async (req, res) => {
  try {
    const { namePattern } = req.params;
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const groups = await MessageModel.getUserGroups(req.user.id);
    const matchingGroup = groups.find(group => 
      group.name.includes(decodeURIComponent(namePattern))
    );
    
    if (matchingGroup) {
      res.json(matchingGroup);
    } else {
      res.status(404).json({ message: 'Group not found' });
    }
  } catch (error) {
    console.error('Error in findGroupByName controller:', error);
    res.status(500).json({ message: 'Failed to find group' });
  }
};

// File upload handler
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `http://localhost:8080/uploads/messages/${req.file.filename}`;
    
    res.json({
      fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('Error in uploadFile controller:', error);
    res.status(500).json({ message: 'Failed to upload file' });
  }
};

// Leave group
export const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const success = await MessageModel.removeFromGroup(groupId, req.user.id);
    
    if (success) {
      res.json({ message: 'Successfully left the group' });
    } else {
      res.status(404).json({ message: 'Group or membership not found' });
    }
  } catch (error) {
    console.error('Error in leaveGroup controller:', error);
    res.status(500).json({ message: 'Failed to leave group' });
  }
};
