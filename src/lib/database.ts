import { supabase } from './supabase'

/**
 * Database functions for minerals table
 * These functions handle read-only operations for the minerals data
 */

export interface Mineral {
  id: string
  title: string
  description: string
  status?: string
  tags?: string | string[] // Can be a single string or array of strings
  // Add other fields as needed
  [key: string]: any
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