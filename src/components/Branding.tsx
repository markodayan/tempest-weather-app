export default function Branding() {
  return (
    <div id='tempest-branding'>
      <a href='/' className='flex items-center justify-center gap-3 mb-2 xl:justify-start'>
        <img src='/tempest-logo-trans.svg' alt='Tempest logo' className='h-9 w-9' />
        <h2 className='text-[32px] font-stretch-extra-condensed  font-extrabold text-search-title-suffix'>
          <span className=' text-tempest-title '>Tempest</span>
        </h2>
      </a>
      <p className='text-center text-sm text-slate-500 xl:text-left'>
        7-day weather forecasts for locations all around the world.
      </p>
    </div>
  );
}
