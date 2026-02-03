import { Skeleton } from "@/components/ui/skeleton"

export const ProductSkeleton = () => {
    return (
        <div className="flex flex-col border rounded-lg overflow-hidden bg-white shadow-sm h-full">
            <div className="relative h-48 w-full p-4 bg-white flex items-center justify-center">
                <Skeleton className="h-40 w-40" />
            </div>
            <div className="flex flex-col grow p-4 gap-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-20" />
                <div className="space-y-2 grow">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-10 w-full mt-auto" />
            </div>
        </div>
    )
}
