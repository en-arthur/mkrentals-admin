import { createAdminClient } from './admin';
import { generateSimpleCredentials, validatePasswordStrength } from '../auth/credential-generator';

// ============ CATEGORIES ============

export async function getAllCategories(includeInactive = false) {
  const supabase = createAdminClient();
  
  let query = supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (!includeInactive) {
    query = query.eq('is_active', true);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
}

export async function getCategoryById(id) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createCategory(categoryData) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('categories')
    .insert([categoryData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateCategory(id, categoryData) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('categories')
    .update(categoryData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteCategory(id) {
  const supabase = createAdminClient();
  
  // Check if category has products
  const { data: products } = await supabase
    .from('products')
    .select('id')
    .eq('category_id', id)
    .limit(1);
  
  if (products && products.length > 0) {
    throw new Error('Cannot delete category with existing products');
  }
  
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// ============ PRODUCTS ============

export async function getAllProducts(includeUnavailable = true) {
  const supabase = createAdminClient();
  
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .order('display_order', { ascending: true });
  
  if (!includeUnavailable) {
    query = query.eq('is_available', true);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
}

export async function getProductById(id) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createProduct(productData) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateProduct(id, productData) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteProduct(id) {
  const supabase = createAdminClient();
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function toggleProductAvailability(id) {
  const supabase = createAdminClient();
  
  // Get current status
  const { data: product } = await supabase
    .from('products')
    .select('is_available')
    .eq('id', id)
    .single();
  
  if (!product) throw new Error('Product not found');
  
  // Toggle status
  const { data, error } = await supabase
    .from('products')
    .update({ is_available: !product.is_available })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ============ QUOTES ============

export async function getAllQuotes(filters = {}) {
  const supabase = createAdminClient();
  
  let query = supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false });
  
  // Apply filters
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters.startDate) {
    query = query.gte('created_at', filters.startDate);
  }
  
  if (filters.endDate) {
    query = query.lte('created_at', filters.endDate);
  }
  
  if (filters.search) {
    query = query.or(`customer_name.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%,customer_phone.ilike.%${filters.search}%`);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
}

export async function getQuoteById(id) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateQuoteStatus(id, status, notes, reviewedBy) {
  const supabase = createAdminClient();
  
  const updateData = {
    status,
    reviewed_at: new Date().toISOString(),
    reviewed_by: reviewedBy
  };
  
  if (notes) {
    updateData.admin_notes = notes;
  }
  
  const { data, error } = await supabase
    .from('quotes')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateQuote(id, quoteData) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('quotes')
    .update(quoteData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getQuotesByStatus(status) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getQuoteStats() {
  const supabase = createAdminClient();
  
  // Get counts by status
  const { data, error } = await supabase
    .from('quotes')
    .select('status');
  
  if (error) throw error;
  
  // Count by status
  const stats = {
    total: data.length,
    pending: data.filter(q => q.status === 'pending').length,
    reviewed: data.filter(q => q.status === 'reviewed').length,
    contacted: data.filter(q => q.status === 'contacted').length,
    accepted: data.filter(q => q.status === 'accepted').length,
    rejected: data.filter(q => q.status === 'rejected').length,
    completed: data.filter(q => q.status === 'completed').length
  };
  
  return stats;
}

// ============ ADMIN USERS ============

export async function hasAnyAdminUsers() {
  const supabase = createAdminClient();

  try {
    console.log('🔍 Checking for admin users in database...');

    // Use count to check if any admin users exist
    const { count, error } = await supabase
      .from('admin_users')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Error checking admin users:', error);
      return false;
    }

    console.log(`🔍 Found ${count || 0} admin users in database`);

    return (count || 0) > 0;
  } catch (error) {
    console.error('❌ Error checking admin users:', error);
    return false;
  }
}

export async function getAdminByUsername(username) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('username', username)
    .eq('is_active', true)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  
  return data;
}

export async function createAdminUser(userData) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('admin_users')
    .insert([userData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateAdminUser(id, userData) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('admin_users')
    .update(userData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateLastLogin(id) {
  const supabase = createAdminClient();
  
  const { error } = await supabase
    .from('admin_users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', id);
  
  if (error) throw error;
}
