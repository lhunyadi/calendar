export interface ColorPaletteProps {
  isOpen: boolean
  onClose: () => void
  paletteButtonRef?: React.RefObject<HTMLButtonElement | null>
}