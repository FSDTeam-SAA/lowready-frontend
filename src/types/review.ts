
interface User {
    name: string
    city: string
    organization: string
}

export interface Review{
    id: number
    user: User
    imglink:string
    rating: number
    comment: string
}