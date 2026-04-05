import { createContext, useContext, useState } from 'react';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([
    {
      id: '1',
      user: { name: 'Ali Khan', profilePic: null },
      text: 'Just launched Social Connect! 🚀',
      image: null,
      likes: 12,
      likedByMe: false,
      timestamp: '2h ago',
      comments: [{ id: 'c1', user: 'Sara', text: 'Amazing!' }]
    }
  ]);

  const addPost = (post) => setPosts(prev => [post, ...prev]);

  const toggleLike = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const newLiked = !p.likedByMe;
        return { ...p, likedByMe: newLiked, likes: newLiked ? p.likes + 1 : p.likes - 1 };
      }
      return p;
    }));
    // Mock notification
    console.log('❤️ Like notification sent!');
  };

  const addComment = (postId, commentText) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, { id: Date.now().toString(), user: 'You', text: commentText }]
        };
      }
      return p;
    }));
  };

  return (
    <PostContext.Provider value={{ posts, addPost, toggleLike, addComment }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => useContext(PostContext);