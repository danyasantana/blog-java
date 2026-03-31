import { Link } from 'react-router-dom';
import { MessageCircle, Eye, User } from 'lucide-react';

export default function PostCard({ post }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
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

      <Link to={`/posts/${post.id}`}>
        <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 mb-2">
          {post.title}
        </h3>
      </Link>

      {post.content && (
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.content}
        </p>
      )}

      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <MessageCircle className="h-4 w-4" />
          <span>{post.commentsCount || 0}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Eye className="h-4 w-4" />
          <span>{post.viewsCount || 0}</span>
        </div>
      </div>
    </div>
  );
}
