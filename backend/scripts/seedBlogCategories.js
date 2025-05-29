const { pool } = require('../config/db');

const sampleCategories = [
  {
    name: 'Ayurvedic Recipes',
    description: 'Traditional and modern Ayurvedic recipes for healthy living',
    meta_title: 'Ayurvedic Recipes - Healthy Traditional Cooking',
    meta_description: 'Discover authentic Ayurvedic recipes that promote health and wellness through traditional cooking methods.'
  },
  {
    name: 'Wellness Tips',
    description: 'Daily wellness tips and practices for a balanced lifestyle',
    meta_title: 'Wellness Tips - Daily Health Practices',
    meta_description: 'Learn practical wellness tips and daily practices for maintaining optimal health and balance.'
  },
  {
    name: 'Herbal Medicine',
    description: 'Information about medicinal herbs and their uses',
    meta_title: 'Herbal Medicine - Natural Healing',
    meta_description: 'Explore the world of herbal medicine and natural healing with traditional remedies.'
  },
  {
    name: 'Yoga & Meditation',
    description: 'Yoga practices and meditation techniques for mind-body wellness',
    meta_title: 'Yoga & Meditation - Mind-Body Wellness',
    meta_description: 'Discover yoga practices and meditation techniques for complete mind-body wellness.'
  },
  {
    name: 'Seasonal Health',
    description: 'Health tips and practices for different seasons',
    meta_title: 'Seasonal Health - Ayurvedic Seasonal Living',
    meta_description: 'Learn how to adapt your health practices according to different seasons with Ayurvedic wisdom.'
  }
];

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

async function seedCategories() {
  try {
    console.log('Starting to seed blog categories...');
    
    for (const category of sampleCategories) {
      const slug = generateSlug(category.name);
      
      // Check if category already exists
      const [existing] = await pool.execute(
        'SELECT category_id FROM blog_categories WHERE name = ? OR slug = ?',
        [category.name, slug]
      );
      
      if (existing.length === 0) {
        await pool.execute(`
          INSERT INTO blog_categories (name, slug, description, meta_title, meta_description, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        `, [
          category.name,
          slug,
          category.description,
          category.meta_title,
          category.meta_description
        ]);
        
        console.log(`✓ Created category: ${category.name}`);
      } else {
        console.log(`- Category already exists: ${category.name}`);
      }
    }
    
    console.log('Blog categories seeding completed!');
    
    // Display all categories
    const [categories] = await pool.execute(`
      SELECT bc.*, COUNT(b.blog_id) as post_count
      FROM blog_categories bc
      LEFT JOIN blogs b ON bc.category_id = b.category_id AND b.status = 'published'
      GROUP BY bc.category_id
      ORDER BY bc.name ASC
    `);
    
    console.log('\nCurrent blog categories:');
    categories.forEach(cat => {
      console.log(`- ${cat.name} (${cat.post_count} posts)`);
    });
    
  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    await pool.end();
  }
}

// Run the seeding function
seedCategories(); 