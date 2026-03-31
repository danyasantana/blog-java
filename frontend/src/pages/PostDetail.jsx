import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postService, commentService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, MessageCircle, Eye, Edit, Trash2 } from 'lucide-react';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await postService.getById(id);
      setPost(response.data);
    } catch (err) {
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentService.getByPost(id);
      setComments(response.data);
    } catch (err) {
      console.error('Failed to load comments');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await commentService.create(id, { content: newComment });
      setNewComment('');
      fetchComments();
    } catch (err) {
      alert('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await postService.delete(id);
      navigate('/');
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600">{error || 'Post not found'}</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    );
  }

  const isOwner = isAuthenticated && user?.id === post.authorId;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to posts
      </Link>

      <article className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <User className="h-4 w-4" />
          <span>{post.authorUsername}</span>
          <span>•</span>
          <span>{formatDate(post.createdAt)}</span>
          {post.status === 'DRAFT' && (
            <>
              <span>•</span>
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">
                Draft
              </span>
            </>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">{post.title}</h1>

        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-8 pb-8 border-b">
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span>{post.viewsCount || 0} views</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4" />
            <span>{comments.length} comments</span>
          </div>
        </div>

        {post.content && (
          <div className="prose max-w-none mb-8 whitespace-pre-wrap">
            {post.content}
          </div>
        )}

        {isOwner && (
          <div className="flex gap-4 pt-4 border-t">
            <Link
              to={`/posts/${id}/edit`}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </article>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Comments ({comments.length})
        </h2>

        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <p className="mb-8 text-gray-600">
            <Link to="/login" className="text-blue-600 hover:underline">Login</Link> to comment.
          </p>
        )}

        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{comment.authorUsername}</span>
                <span>•</span>
                <span>{formatDate(comment.createdAt)}</span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No comments yet. Be the first to comment!
          </p>
        )}
      </section>
    </div>
  );
}
