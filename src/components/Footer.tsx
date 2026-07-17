import { Globe } from 'lucide-react';

// lucide-react doesn't ship brand/logo icons (GitHub included), so this is a small inline SVG
// of the standard GitHub mark instead of pulling in a separate icon package for one icon.
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' className={className} aria-hidden='true'>
      <path d='M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.79-.25.79-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.9-.39.98 0 1.98.13 2.9.39 2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.08.78 2.17 0 1.57-.01 2.83-.01 3.22 0 .3.21.66.8.55A11.52 11.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z' />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className='mx-auto w-full xl:px-0 py-8 bg-[#343434] '>
      <div
        id='footer-contents-container'
        className='text-center flex lg:flex-col justify-between items-center lg:gap-x-0 lg:gap-y-3 px-8'
      >
        <p className='text-sm text-slate-400'>
          Created by <span className='font-medium text-slate-500'>Mark Odayan</span>
        </p>
        <div className='flex items-center justify-center gap-2 lg:gap-4'>
          <a
            href='https://github.com/markodayan'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='GitHub'
            className='text-slate-400 transition-colors duration-300 hover:text-primary'
          >
            <GithubIcon className='h-5 w-5' />
          </a>
          <a
            href='https://odayan.xyz'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Personal website'
            className='text-slate-400 transition-colors duration-300 hover:text-primary'
          >
            <Globe className='h-5 w-5' />
          </a>
        </div>
      </div>
    </footer>
  );
}
