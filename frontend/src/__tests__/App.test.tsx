import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import App from '../App'
import '../types/index.d.ts'

jest.mock('../envVars.ts')

test('Renders the main page', () => {
    render(<App />)
    expect(true).toBeTruthy()
})
