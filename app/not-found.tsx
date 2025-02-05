import { Button } from "@/components/ui/button"
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-1 flex-col min-h-svh items-center justify-center gap-6 bg-background p-6 md:p-10">
    <div className="text-center">
      <p className="text-base font-semibold text-primary">404</p>
      <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-primary sm:text-7xl">
        Page not found
      </h1>
      <p className="mt-6 text-pretty text-lg font-medium text-muted-foreground sm:text-xl/8">
        Lost, this page is. In another system, it may be.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-y-3 gap-x-6">
        <Button className="-order-1 sm:order-none" asChild>
          <Link href="/">Take me home</Link>
        </Button>
      </div>
    </div>
    </div>
  )
}

export default NotFound;