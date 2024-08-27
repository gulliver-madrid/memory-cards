import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import useGame, { GameView } from '../hooks/useGame'
import { reprCardData } from '../model'
import { CardData, Game } from '../types'
import { repr } from '../utils'
import Card from './Card'
import CardSequence from './CardSequence'
import CardsToClick from './CardsToClick'
import './GameWidget.css'

interface Props {
    gameIndex: number
    numberOfCardsToRemember: number
    onGameFinished: () => void
    addGame: (game: Game) => void
    providedSequence?: ReadonlyArray<CardData> | null
}

const GameWidget = ({
    onGameFinished,
    numberOfCardsToRemember,
    addGame,
    gameIndex,
    providedSequence = null,
}: Props) => {
    const addCurrentGame = useRef(addGame).current
    const {
        status,
        win,
        cardValue,
        sequenceToRemember,
        userSequence,
        addCard,
    } = useGame(onGameFinished, numberOfCardsToRemember, providedSequence)
    useEffect(() => {
        if (win !== null) {
            addCurrentGame({ gameIndex: gameIndex, isWin: win })
        }
        return
    }, [gameIndex, win, addCurrentGame])

    return (
        <div
            data-testid="game-widget-container"
            className="game-screen"
            data-status={status}
            data-card-value={cardValue && reprCardData(cardValue)}
            data-win={repr(win)}
        >
            <GameWidgetContent
                status={status}
                win={win}
                cardValue={cardValue}
                sequenceToRemember={sequenceToRemember}
                userSequence={userSequence}
                addCard={addCard}
            />
        </div>
    )
}

const GameWidgetContent = ({
    status,
    win,
    cardValue,
    sequenceToRemember,
    userSequence,
    addCard,
}: GameView) => {
    const { t } = useTranslation()

    switch (status) {
        case 'initial':
            return <p>{t('Game starting')}</p>
        case 'showing-cards':
            return (
                cardValue && (
                    <div className="card-display">
                        <Card shape={cardValue.shape} color={cardValue.color} />
                    </div>
                )
            )
        case 'pause-before-answering':
            return <p>{t('Cards displayed')}</p>
        case 'answering':
            return (
                <>
                    <div className="GameWidget_container">
                        <CardsToClick addCard={addCard} />
                    </div>
                    <SmallCardSequenceWithTitle
                        title={t('Your sequence')}
                        sequence={userSequence}
                    />
                </>
            )
        case 'showing-results':
            return (
                <>
                    <h2>{win === true ? t('win') : t('lost')}</h2>
                    <SmallCardSequenceWithTitle
                        title={t('Your sequence')}
                        sequence={userSequence}
                    />
                    <SmallCardSequenceWithTitle
                        title={t('Actual sequence')}
                        sequence={sequenceToRemember}
                    />
                </>
            )
        default:
            console.error('Unknown status: ' + status)
            return
    }
}

const SmallCardSequenceWithTitle = ({
    title,
    sequence,
}: {
    title: string
    sequence: ReadonlyArray<CardData>
}) => {
    return (
        <>
            <p>{title}</p>
            <div className="CardSequence_sequence">
                <CardSequence sequence={sequence} scale={0.4} />
            </div>
        </>
    )
}

export default GameWidget
