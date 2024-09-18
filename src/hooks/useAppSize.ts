export interface AppSizeProps {
  appHeight?: number;
  appWidth?: number;
}

export const useAppSize = () => {
  const appHeight = window.innerHeight;
  const appWidth = (appHeight * 1.5) / 2;

  return { appHeight, appWidth };
};
