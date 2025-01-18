import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define route matchers
const isAuthRoute = createRouteMatcher(["/sign-in", "/sign-up"]);
const isProtectedRoute = createRouteMatcher(["/home","/global","/video"]);
const isPublicRoute = createRouteMatcher(["/","/api/videos"]);

export default clerkMiddleware(async (auth, req) => {
  const user = await auth();
  const currentURL = new URL(req.url);
  const homeReq = currentURL.pathname === "/home";
  const apiReq = currentURL.pathname.startsWith("/api");


  if(!user.userId) {
    // Accessing Protected Routes
    if(isProtectedRoute(req)){
      return NextResponse.redirect(new URL("/sign-in",req.url));
    }
  }else{
    // Accessing Auth Routes    
    if(isAuthRoute(req)){
      return NextResponse.redirect(new URL("/home",req.url));
    }
  }
  return NextResponse.next();
});

// Configure middleware to apply to specific routes
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};