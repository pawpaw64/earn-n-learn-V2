
import MessageModel from '../models/messageModel.js';

// Create a new conversation
export const createConversation = async (req, res) => {
  try {
    const { title, participants } = req.body;
    const creator_id = req.user.id;
    
    const result = await MessageModel.createConversation({
      title,
      creator_id,
      participants
    });
    
    res.status(201).json({
      success: true,
      conversationId: result.conversationId,
      message: 'Conversation created successfully'
    });
  } catch (error) {
    console.error('createConversation() - Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create conversation'
    });
  }
};

// Create or get direct conversation between two users
export const createOrGetDirectConversation = async (req, res) => {
  try {
    const { recipient_id } = req.body;
    const user_id = req.user.id;
    
    if (user_id === parseInt(recipient_id)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create conversation with yourself'
      });
    }
    
    const result = await MessageModel.createOrGetDirectConversation(user_id, recipient_id);
    
    res.status(200).json({
      success: true,
      conversationId: result.conversationId,
      isNew: result.isNew,
      message: result.isNew ? 'Direct conversation created' : 'Existing conversation found'
    });
  } catch (error) {
    console.error('createOrGetDirectConversation() - Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create or get conversation'
    });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { conversation_id, content, attachment_url } = req.body;
    const sender_id = req.user.id;
    
    const result = await MessageModel.sendMessage({
      conversation_id,
      sender_id,
      content,
      attachment_url
    });
    
    res.status(201).json({
      success: true,
      messageId: result.messageId,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('sendMessage() - Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send message'
    });
  }
};

// Get all conversations for current user
export const getConversations = async (req, res) => {
  try {
    const user_id = req.user.id;
    const conversations = await MessageModel.getConversationsByUserId(user_id);
    
    res.status(200).json(conversations);
  } catch (error) {
    console.error('getConversations() - Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get conversations'
    });
  }
};

// Get messages from a conversation
export const getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    
    const messages = await MessageModel.getMessagesByConversationId(id, user_id);
    
    res.status(200).json(messages);
  } catch (error) {
    console.error('getMessages() - Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get messages'
    });
  }
};

// Get conversation details
export const getConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    
    const conversation = await MessageModel.getConversationDetails(id, user_id);
    
    res.status(200).json(conversation);
  } catch (error) {
    console.error('getConversation() - Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get conversation details'
    });
  }
};

// Search conversations
export const searchConversations = async (req, res) => {
  try {
    const { term } = req.query;
    const user_id = req.user.id;
    
    if (!term) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }
    
    const conversations = await MessageModel.searchConversations(user_id, term);
    
    res.status(200).json(conversations);
  } catch (error) {
    console.error('searchConversations() - Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to search conversations'
    });
  }
};
