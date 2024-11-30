import type { Partner } from './partner'

export type Database = {
    public: {
        Tables: {
            partners: {
                Row: Partner
                Insert: Omit<Partner, 'id'>
                Update: Partial<Omit<Partner, 'id'>>
            }
        }
    }
}