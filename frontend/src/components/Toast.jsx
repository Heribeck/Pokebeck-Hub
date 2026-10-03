import { useState, useEffect } from 'react'
import { registerToast } from '../shared/toast/index.js'

export default function Toast() {
    const [message, setMessage] = useState('')
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        registerToast((msg) => {
            setMessage(msg)
            setVisible(true)
            setTimeout(() => setVisible(false), 2000)
        })
    }, [])

    return (
        <div className={`ToastMessage ${visible ? 'IsVisible' : ''}`}>
            <p><span>{message}</span></p>
        </div>
    )
}