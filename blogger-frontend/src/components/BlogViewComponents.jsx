
import React, { useState, useEffect } from 'react';
import './CommentThread.css';
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { blogAPI } from "../api/blogAPI.js";
import { useAuth } from "../misc/AuthContext.jsx";

const Comment = ({ comment, addReply, level = 0, updateCommentList }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const { currentUser } = useAuth();

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (replyText.trim()) {
      try {
        const response = await blogAPI.addComment(
          comment.blogId, 
          currentUser.username, 
          replyText, 
          comment.commentId
        );
        
        // Update the comment list with the new reply
        if (response.result) {
          updateCommentList(response.result.comment);
          setReplyText('');
          setIsReplying(false);
        }
      } catch (error) {
        console.error("Error adding reply:", error);
        alert("Failed to add reply. Please try again.");
      }
    }
  };

  return (
    <div className="comment-container">
      <div className="comment-wrapper">
        {level > 0 && <div className="thread-line"></div>}
        <div className="comment-content">
          <div className="comment-header">
            <div className="avatar">
              {comment.author}
            </div>
            <div className="author-info">
              <div className="author-name">{comment.author}</div>
              <div className="timestamp">
                {new Date(comment.timestamp).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <p className="comment-text">{comment.content}</p>
          
          <button
            onClick={() => setIsReplying(!isReplying)}
            className="reply-button"
          >
            Reply
          </button>

          {isReplying && (
            <form onSubmit={handleSubmitReply} className="reply-form">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                rows="2"
              />
              <div className="button-group">
                <button type="submit" className="submit-button">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setIsReplying(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="replies-container">
          {comment.replies.map(reply => (
            <Comment
              key={reply.commentId}
              comment={reply}
              addReply={addReply}
              level={level + 1}
              updateCommentList={updateCommentList}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CommentThread = ({ blogId, blogStats, blog, updateBlogStats }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { currentUser } = useAuth();

  // Fetch comments when component mounts or blogId changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await blogAPI.getBlogComments(blogId);
        if (response.result && response.result.comments) {
          // Organize comments into a tree structure
          const commentMap = new Map();
          const rootComments = [];

          // First pass: create map of all comments
          response.result.comments.forEach(comment => {
            comment.replies = [];
            commentMap.set(comment.commentId, comment);
          });

          // Second pass: build tree structure
          response.result.comments.forEach(comment => {
            if (comment.parentId) {
              const parentComment = commentMap.get(comment.parentId);
              if (parentComment) {
                parentComment.replies.push(comment);
              }
            } else {
              rootComments.push(comment);
            }
          });

          setComments(rootComments);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [blogId]);

  // Update comment list after adding a new comment or reply
  const updateCommentList = (newComment) => {
    const addCommentToTree = (commentList) => {
      // If no parent, add to root
      if (!newComment.parentId) {
        return [...commentList, newComment];
      }

      // Recursive function to add comment to the right place in the tree
      const updateComments = (comments) => {
        return comments.map(comment => {
          if (comment.commentId === newComment.parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment]
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: updateComments(comment.replies)
            };
          }
          return comment;
        });
      };

      return updateComments(commentList);
    };

    setComments(prevComments => addCommentToTree(prevComments));
  };

  // Handle adding a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        const response = await blogAPI.addComment(
          blogId, 
          currentUser.username, 
          newComment
        );
        
        if (response.result) {
          updateCommentList(response.result.comment);
          setNewComment('');
          
          // Update blog stats
          updateBlogStats({ 
            comments: (blogStats.comments || 0) + 1 
          });
        }
      } catch (error) {
        console.error("Error adding comment:", error);
        alert("Failed to add comment. Please try again.");
      }
    }
  };

  // Handle Like functionality
  const handleLike = async () => {
    try {
      if (blogStats.userLiked) {
        // If already liked, unlike
        await blogAPI.unlike(blogId);
        updateBlogStats({ 
          likes: blogStats.likes - 1,
          userLiked: false
        });
      } else {
        // If not liked, like (and handle previous dislike)
        await blogAPI.likeBlog(blogId);
        
        if (blogStats.userDisliked) {
          // If previously disliked, remove dislike
          updateBlogStats({ 
            likes: blogStats.likes + 1,
            dislikes: blogStats.dislikes - 1,
            userLiked: true,
            userDisliked: false
          });
        } else {
          updateBlogStats({ 
            likes: blogStats.likes + 1,
            userLiked: true
          });
        }
      }
    } catch (error) {
      console.error("Error with like/unlike:", error);
      alert("Unable to process like/unlike. Please try again.");
    }
  };

  // Handle Dislike functionality
  const handleDislike = async () => {
    try {
      if (blogStats.userDisliked) {
        // If already disliked, undislike
        await blogAPI.undislike(blogId);
        updateBlogStats({ 
          dislikes: blogStats.dislikes - 1,
          userDisliked: false
        });
      } else {
        // If not disliked, dislike (and handle previous like)
        await blogAPI.dislikeBlog(blogId);
        
        if (blogStats.userLiked) {
          // If previously liked, remove like
          updateBlogStats({ 
            dislikes: blogStats.dislikes + 1,
            likes: blogStats.likes - 1,
            userDisliked: true,
            userLiked: false
          });
        } else {
          updateBlogStats({ 
            dislikes: blogStats.dislikes + 1,
            userDisliked: true
          });
        }
      }
    } catch (error) {
      console.error("Error with dislike/undislike:", error);
      alert("Unable to process dislike/undislike. Please try again.");
    }
  };

  return (
    <div className="comment-section">
      <div className='blog-stats'>
        <div 
          className='like-dislike' 
          onClick={handleLike}
        >
          <AiFillLike 
            size={30} 
            color={blogStats.userLiked ? 'blue' : ''}
          />
          <p>{blogStats.likes}</p>
        </div>
        <div 
          className='like-dislike' 
          onClick={handleDislike}
        >
          <AiFillDislike 
            size={30} 
            color={blogStats.userDisliked ? 'blue' : ''}
          />
          <p>{blogStats.dislikes}</p>
        </div>        
      </div>
      <h2 className="section-title">Comments</h2>
      
      <form onSubmit={handleAddComment} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="comment-input"
          placeholder="Write a comment..."
          rows="3"
        />
        <button type="submit" className="submit-comment-btn">
          Add Comment
        </button>
      </form>

      <div className="comments-container">
        {comments.map(comment => (
          <Comment
            key={comment.commentId}
            comment={comment}
            addReply={handleAddComment}
            updateCommentList={updateCommentList}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentThread;