import localFont from 'next/font/local'

const geistRegular = localFont({
	src: [
		{
			path: './geist/1.3.0/GeistVF.woff2',
		}
	],
	variable: '--font-geist',
	display: 'swap',
})
const geistMono = localFont({
	src: [
		{
			path: './geist-mono/1.3.0/GeistMonoVF.woff2',
		}
	],
	variable: '--font-geist-mono',
	display: 'swap',
})
const materialIconsOutlined = localFont({
	src: [
		{
			path: './material-icons/4.0.0/MaterialSymbolsOutlined-VariableFont_FILL,GRAD,opsz,wght.ttf',
		}
	],
	variable: '--font-icons-outlined',
	display: 'swap',
})
const materialIconsRounded = localFont({
	src: [
		{
			path: './material-icons/4.0.0/MaterialSymbolsRounded-VariableFont_FILL,GRAD,opsz,wght.ttf',
		}
	],
	variable: '--font-icons-rounded',
	display: 'swap',
})
const materialIconsSharp = localFont({
	src: [
		{
			path: './material-icons/4.0.0/MaterialSymbolsSharp-VariableFont_FILL,GRAD,opsz,wght.ttf',
		}
	],
	variable: '--font-icons-sharp',
	display: 'swap',
})

export { geistRegular, geistMono, materialIconsOutlined, materialIconsRounded, materialIconsSharp }