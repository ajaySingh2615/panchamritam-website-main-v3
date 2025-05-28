# Environment Variables Required for Blog System

## Required Environment Variables

Add these environment variables to your `.env` file in the frontend directory:

### TinyMCE Rich Text Editor Configuration
```
REACT_APP_TINYMCE_API_KEY=your_tinymce_api_key
```
**How to get TinyMCE API Key:**
1. Go to https://www.tiny.cloud/
2. Sign up for a free account
3. Go to your dashboard
4. Copy your API key from the "API Key Manager" section
5. Free tier allows up to 1,000 editor loads per month

### Base URL Configuration
```
REACT_APP_BASE_URL=http://localhost:3000
REACT_APP_API_URL=http://localhost:5000
```

### Image Upload Configuration
```
REACT_APP_MAX_IMAGE_SIZE=5242880
REACT_APP_ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

### Blog Configuration
```
REACT_APP_BLOG_POSTS_PER_PAGE=10
REACT_APP_BLOG_EXCERPT_LENGTH=150
```

### SEO Configuration
```
REACT_APP_SITE_NAME=Panchamritam
REACT_APP_SITE_DESCRIPTION=Premium Ayurvedic Products and Blog
REACT_APP_SITE_URL=https://panchamritam.com
```

### Social Media Configuration
```
REACT_APP_FACEBOOK_URL=https://facebook.com/panchamritam
REACT_APP_TWITTER_URL=https://twitter.com/panchamritam
REACT_APP_INSTAGRAM_URL=https://instagram.com/panchamritam
REACT_APP_LINKEDIN_URL=https://linkedin.com/company/panchamritam
```

### Optional Analytics Configuration
```
REACT_APP_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
REACT_APP_GOOGLE_TAG_MANAGER_ID=GTM_CONTAINER_ID
```

### Cloudinary Configuration (for image uploads)
```
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
REACT_APP_CLOUDINARY_API_KEY=your_cloudinary_api_key
REACT_APP_CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Firebase Configuration (if using Firebase for additional features)
```
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Minimum Required Variables for Blog System to Work

For the blog system to work at minimum, you need:

1. **REACT_APP_TINYMCE_API_KEY** - Get from https://www.tiny.cloud/
2. **REACT_APP_BASE_URL** - Your frontend URL (usually http://localhost:3000 for development)
3. **REACT_APP_API_URL** - Your backend URL (usually http://localhost:5000 for development)

## How to Set Up

1. Create a `.env` file in the `frontend` directory
2. Add the required environment variables
3. Restart your React development server
4. The rich text editor should now work properly

## TinyMCE Features Included

- Rich text formatting (bold, italic, colors)
- Lists and alignment
- Links and media embedding
- Image upload functionality
- Code samples with syntax highlighting
- Templates for blog posts and tutorials
- Full-screen editing mode
- Word count and character count
- Emoticons and special characters
- Table creation and editing

## Image Upload Setup

The TinyMCE editor is configured to upload images to `/api/upload/image` endpoint. Make sure your backend has this endpoint implemented for image uploads to work properly. 