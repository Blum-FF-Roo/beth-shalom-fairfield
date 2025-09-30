'use client';

import { lazy } from 'react';
import SuspenseWrapper from '@/app/components/ui/SuspenseWrapper';
import { HeroSliderSkeleton, AboutSectionSkeleton, ProgramsSectionSkeleton, AdminCardSkeleton } from '@/app/components/ui/SkeletonLoaders';

// Lazy load heavy components
export const LazyHeroSliderRefresh = lazy(() => import('@/app/components/sections/HeroSliderRefresh'));
export const LazyAboutSectionRefresh = lazy(() => import('@/app/components/sections/AboutSectionRefresh'));
export const LazyProgramsSection = lazy(() => import('@/app/components/sections/ProgramsSection'));

// Admin components
export const LazyAdminDashboard = lazy(() => import('@/app/components/admin/AdminDashboard'));
export const LazyUserManagement = lazy(() => import('@/app/components/admin/UserManagement'));
export const LazyPostForm = lazy(() => import('@/app/components/admin/PostForm'));
export const LazyRichTextEditor = lazy(() => import('@/app/components/admin/RichTextEditor'));

// Payment components
export const LazyPayPalDonation = lazy(() => import('@/app/components/PayPalDonation'));
export const LazyMembershipCart = lazy(() => import('@/app/components/MembershipCart'));
export const LazyHighHolyDaysCart = lazy(() => import('@/app/components/HighHolyDaysCart'));
export const LazyPassoverCart = lazy(() => import('@/app/components/PassoverCart'));

// Media components
export const LazyYouTubeEmbed = lazy(() => import('@/app/components/LazyYouTubeEmbed'));

// Wrapped versions with appropriate loading states
export function HeroSliderWithSuspense() {
  return (
    <SuspenseWrapper fallback={<HeroSliderSkeleton />}>
      <LazyHeroSliderRefresh />
    </SuspenseWrapper>
  );
}

export function AboutSectionWithSuspense() {
  return (
    <SuspenseWrapper fallback={<AboutSectionSkeleton />}>
      <LazyAboutSectionRefresh />
    </SuspenseWrapper>
  );
}

export function ProgramsSectionWithSuspense() {
  return (
    <SuspenseWrapper fallback={<ProgramsSectionSkeleton />}>
      <LazyProgramsSection />
    </SuspenseWrapper>
  );
}

export function AdminDashboardWithSuspense() {
  return (
    <SuspenseWrapper fallback={<AdminCardSkeleton />}>
      <LazyAdminDashboard />
    </SuspenseWrapper>
  );
}

export function UserManagementWithSuspense() {
  return (
    <SuspenseWrapper fallback={<AdminCardSkeleton />}>
      <LazyUserManagement />
    </SuspenseWrapper>
  );
}

export function PayPalDonationWithSuspense(props: Record<string, unknown>) {
  return (
    <SuspenseWrapper>
      <LazyPayPalDonation {...props} />
    </SuspenseWrapper>
  );
}

export function MembershipCartWithSuspense() {
  return (
    <SuspenseWrapper>
      <LazyMembershipCart />
    </SuspenseWrapper>
  );
}

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  className?: string;
}

export function YouTubeEmbedWithSuspense(props: YouTubeEmbedProps) {
  return (
    <SuspenseWrapper>
      <LazyYouTubeEmbed {...props} />
    </SuspenseWrapper>
  );
}