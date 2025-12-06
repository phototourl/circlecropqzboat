import { cn } from '@/lib/utils';
import Image from 'next/image';

export function MkSaaSLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/circle-crop-logo.png"
      alt="Logo of Circle Crop Image"
      title="Logo of Circle Crop Image"
      width={96}
      height={96}
      className={cn('size-8 rounded-md', className)}
    />
  );
}
