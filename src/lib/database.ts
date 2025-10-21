import { supabase } from './supabase'

/**
 * Database functions for minerals table
 * These functions handle read-only operations for the minerals data
 */

export interface Mineral {
  id: string
  title: string
  slug: string
  description: string | null
  category: string | null
  video_url: string | null
  meta_title: string | null
  meta_description: string | null
  images: any[] // JSONB array of image objects
  status: 'draft' | 'published' | 'archived' | null
  color: string | null
  created_at: string
  updated_at: string
}

// Get all minerals from the minerals table
export async function getMinerals(): Promise<Mineral[]> {
  const { data, error } = await supabase
    .from('minerals')
    .select('*')
    .order('title')

  if (error) {
    console.error('Error fetching minerals:', error)
    throw error
  }

  return data || []
}

// Get a specific mineral by ID
export async function getMineralById(id: string): Promise<Mineral | null> {
  const { data, error } = await supabase
    .from('minerals')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching mineral:', error)
    throw error
  }

  return data
}

// Get a specific mineral by slug
export async function getMineralBySlug(slug: string): Promise<Mineral | null> {
  const { data, error } = await supabase
    .from('minerals')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching mineral by slug:', error)
    throw error
  }

  return data
}

// Search minerals by title
export async function searchMinerals(searchTerm: string): Promise<Mineral[]> {
  const { data, error } = await supabase
    .from('minerals')
    .select('*')
    .ilike('title', `%${searchTerm}%`)
    .order('title')

  if (error) {
    console.error('Error searching minerals:', error)
    throw error
  }

  return data || []
}

// Get minerals by category (if you have a category column)
export async function getMineralsByCategory(category: string): Promise<Mineral[]> {
  const { data, error } = await supabase
    .from('minerals')
    .select('*')
    .eq('category', category)
    .order('title')

  if (error) {
    console.error('Error fetching minerals by category:', error)
    throw error
  }

  return data || []
}

// Get featured minerals (if you have a featured column)
export async function getFeaturedMinerals(): Promise<Mineral[]> {
  const { data, error } = await supabase
    .from('minerals')
    .select('*')
    .eq('featured', true)
    .order('title')
    .limit(6)

  if (error) {
    console.error('Error fetching featured minerals:', error)
    throw error
  }

  return data || []
}

// Get most recent minerals (3 most recent additions)
export async function getRecentMinerals(limit: number = 3): Promise<Mineral[]> {
  const { data, error } = await supabase
    .from('minerals')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent minerals:', error)
    return []
  }

  return data || []
}

// Get count of all published minerals
export async function getMineralsCount(): Promise<number> {
  const { count, error } = await supabase
    .from('minerals')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  if (error) {
    console.error('Error counting minerals:', error)
    return 0
  }

  return count || 0
}

// Staff interface
export interface Staff {
  id: string
  title: string
  description: string | null
  image: string | null
  created_at: string
  updated_at: string
}

// Get all staff members
export async function getStaff(): Promise<Staff[]> {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .order('created_at')

  if (error) {
    console.error('Error fetching staff:', error)
    return []
  }

  return data || []
}

// FAQ interface
export interface FAQ {
  id: string
  question: string
  answer: string
  display_order: number
  created_at: string
  updated_at: string
}

// Get all FAQs
export async function getFAQs(): Promise<FAQ[]> {
  const { data, error } = await supabase
    .from('faq')
    .select('*')
    .order('display_order')

  if (error) {
    console.error('Error fetching FAQs:', error)
    return []
  }

  return data || []
}

// Category interface
export interface Category {
  id: string
  name: string
  description: string | null
  color: string
  created_at: string
  updated_at: string
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}

// Get a specific category by name
export async function getCategoryByName(name: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('name', name)
    .single()

  if (error) {
    console.error('Error fetching category:', error)
    return null
  }

  return data
}