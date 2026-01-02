import { updateTodo, deleteTodo } from '../api/todo.api'
import { useState } from 'react'

export default function TodoItem({ todo, refresh }) {
  console.log(todo.image, " todo image url")
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editImage, setEditImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState(
    todo.image ? `http://localhost:3000${todo.image}` : null
  )

  const handleToggle = async () => {
    try {
      setLoading(true)
      await updateTodo(todo._id, { completed: !todo.completed })
      await refresh()
    } catch (error) {
      console.error('Error updating todo:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setLoading(true)
        await deleteTodo(todo._id)
        await refresh()
      } catch (error) {
        console.error('Error deleting todo:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (editTitle.trim() === '') return

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('title', editTitle.trim())
      if (editImage) {
        formData.append('image', editImage)
      }
      console.log("update function is invoked")
      await updateTodo(todo._id, formData)
      setIsEditing(false)
      setEditImage(null)
      await refresh()
    } catch (error) {
      console.error('Error updating todo:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEditImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditTitle(todo.title)
    setEditImage(null)
    setPreviewImage(todo.image ? `http://localhost:3000${todo.image}` : null)
  }

  if (isEditing) {
    return (
      <form
        onSubmit={handleUpdate}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 shadow-md"
      >
        <div className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Task Title
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              placeholder="Edit task..."
              autoFocus
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Update Image (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex-1 cursor-pointer">
                <div className="px-4 py-2.5 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 transition text-center">
                  <svg
                    className="w-6 h-6 text-gray-400 mx-auto mb-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {editImage ? editImage.name : 'Choose new image...'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </label>

              {previewImage && (
                <div className="relative">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null)
                      setEditImage(null)
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              disabled={loading || !editTitle.trim()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              disabled={loading}
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    )
  }

  return (
    <div
      className={`group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all duration-300 ${
        todo.completed ? 'opacity-80' : ''
      }`}
    >
      <div className="flex items-start space-x-4">
        {/* Custom Checkbox */}
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`mt-1 flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
            todo.completed
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-500'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700'
          } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          aria-label={
            todo.completed ? 'Mark as incomplete' : 'Mark as complete'
          }
        >
          {todo.completed && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3
                className={`text-gray-900 dark:text-white font-medium leading-relaxed ${
                  todo.completed
                    ? 'line-through text-gray-500 dark:text-gray-400'
                    : ''
                }`}
              >
                {todo.title}
              </h3>
              <div className="flex items-center space-x-3 mt-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    todo.completed
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}
                >
                  {todo.completed ? 'Completed' : 'Pending'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(todo.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Image Preview */}
            {todo.image && (
              <div className="relative group/image ml-4">
                <img
                  src={`http://localhost:3000${todo.image}`}
                  alt="Task attachment"
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover/image:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <a
                    href={`http://localhost:3000${todo.image}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white p-1 hover:text-blue-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={() => setIsEditing(true)}
              disabled={loading}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>

            <div className="flex-1"></div>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="inline-flex items-center text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-1 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
