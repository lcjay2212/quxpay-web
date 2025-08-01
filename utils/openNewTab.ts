// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const openInNewTab = (url: string) => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const navigateWithNewTab = (url: string, router: any) => {
  // Check if the URL is HTTPS (external link)
  if (url.startsWith('https://') || url.startsWith('http://')) {
    openInNewTab(url);
  } else {
    // Internal route - use normal navigation
    void router.push(url);
  }
};
