import { useEffect, useRef, useState } from 'react'
import {
    cardsData,
    createValidSequence,
    getResult,
    numberOfCardsToGuess,
} from '../model'
import { CardData } from '../types'
import Card from './Card'
import './GameWidget.css'

const GameWidget = () => {
    const intervalIdRef = useRef(0)
    const [sequence, setSequence] = useState<ReadonlyArray<CardData>>([])
    const [currentStep, setCurrentStep] = useState<number | null>(null)
    const [answering, setAnswering] = useState(false)
    const [userSequence, setUserSequence] = useState<CardData[]>([])
    const [win, setWin] = useState<boolean | null>(null)

    const started = currentStep !== null
    const showingSequence =
        sequence.length && started && currentStep < sequence.length
    const cardValue = showingSequence ? sequence[currentStep] : null

    useEffect(() => {
        setSequence(createValidSequence(numberOfCardsToGuess))
        // Display the cards sequentially
        intervalIdRef.current = setInterval(() => {
            setCurrentStep((step) => (step === null ? 0 : step + 1))
        }, 2000)

        return () => clearInterval(intervalIdRef.current)
    }, [])

    const finished = currentStep && currentStep >= sequence.length

    useEffect(() => {
        if (!finished || answering) {
            return
        }
        intervalIdRef.current = setInterval(() => {
            setAnswering(true)
        }, 2000)

        return () => clearInterval(intervalIdRef.current)
    }, [finished, answering])

    if (intervalIdRef.current !== null && finished) {
        clearInterval(intervalIdRef.current)
    }

    useEffect(() => {
        if (userSequence.length === numberOfCardsToGuess) {
            setAnswering(false)
            const result = getResult(sequence, userSequence)
            setWin(result)
        }
    }, [sequence, userSequence])

    return (
        <div className="game-screen">
            {cardValue ? (
                <div className="card-display">
                    <Card shape={cardValue.shape} color={cardValue.color} />
                </div>
            ) : finished ? (
                answering ? (
                    cardsData.map((cardData) => (
                        <div
                            key={cardData.shape + cardData.color}
                            onClick={() => {
                                setUserSequence([...userSequence, cardData])
                            }}
                        >
                            {cardData.shape} {cardData.color}
                        </div>
                    ))
                ) : win === null ? (
                    <p>Cards displayed! Do you remember them?</p>
                ) : win === true ? (
                    'You win!'
                ) : (
                    "You've lost"
                )
            ) : (
                <p>The Game is starting!</p>
            )}
        </div>
    )
}

export default GameWidget
