export interface TAppResponse<T> {
    success: boolean
    statusCode: number
    message: string
    meta?: Meta
    data: T
}

export interface Meta {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
}

export interface TCategory {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    _count: Count
}

interface Count {
    products: number
}
