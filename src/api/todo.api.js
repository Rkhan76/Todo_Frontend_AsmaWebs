
import axiosConfig from '../config/axiosConfig'

export const getTodos = async () => {
  try {
    const response = await axiosConfig.get('/todos')
    return {
      success: true,
      data: response.data,
      status: response.status,
    }
  } catch (error) {
    console.error('Error fetching todos:', error)
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch todos',
      status: error.response?.status || 500,
      data: null,
    }
  }
}

export const createTodo = async (formData) => {
  try {
    // Validate form data
    if (!formData.get('title')?.trim()) {
      throw new Error('Title is required')
    }

    const response = await axiosConfig.post('/todos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        console.log(`Upload Progress: ${percentCompleted}%`)
      },
    })

    return {
      success: true,
      data: response.data,
      status: response.status,
      message: 'Todo created successfully',
    }
  } catch (error) {
    console.error('Error creating todo:', error)

    // Handle different error types
    let errorMessage = 'Failed to create todo'

    if (error.response) {
      // Server responded with error
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Server error: ${error.response.status}`
    } else if (error.request) {
      // Request was made but no response
      errorMessage = 'No response from server. Please check your connection.'
    } else if (error.message === 'Title is required') {
      errorMessage = error.message
    }

    return {
      success: false,
      error: errorMessage,
      status: error.response?.status || 500,
      data: null,
    }
  }
}

export const updateTodo = async (id, data) => {
  try {
    // Check if data is FormData (for image upload) or regular object
    const isFormData = data instanceof FormData
    const config = isFormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {}

      console.log("hllo update to do api hited")
    const response = await axiosConfig.patch(`/todos/${id}`, data, config)
    console.log("response of updated api")

    return {
      success: true,
      data: response.data,
      status: response.status,
      message: 'Todo updated successfully',
    }
  } catch (error) {
    console.error('Error updating todo:', error)

    let errorMessage = 'Failed to update todo'

    if (error.response) {
      if (error.response.status === 404) {
        errorMessage = 'Todo not found'
      } else if (error.response.status === 400) {
        errorMessage = 'Invalid data provided'
      } else {
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`
      }
    } else if (error.request) {
      errorMessage = 'No response from server. Please check your connection.'
    }

    return {
      success: false,
      error: errorMessage,
      status: error.response?.status || 500,
      data: null,
    }
  }
}

export const deleteTodo = async (id) => {
  try {
    const response = await axiosConfig.delete(`/todos/${id}`)

    return {
      success: true,
      data: response.data,
      status: response.status,
      message: 'Todo deleted successfully',
    }
  } catch (error) {
    console.error('Error deleting todo:', error)

    let errorMessage = 'Failed to delete todo'

    if (error.response) {
      if (error.response.status === 404) {
        errorMessage = 'Todo not found'
      } else if (error.response.status === 403) {
        errorMessage = 'You do not have permission to delete this todo'
      } else {
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`
      }
    } else if (error.request) {
      errorMessage = 'No response from server. Please check your connection.'
    }

    return {
      success: false,
      error: errorMessage,
      status: error.response?.status || 500,
      data: null,
    }
  }
}
