
import { BsFillPlayFill, BsFillPauseFill  } from 'react-icons/bs'
import { MdOutlinePanoramaWideAngle, MdOutlinePanoramaWideAngleSelect  } from 'react-icons/md'
import { RiFullscreenExitLine, RiFullscreenFill  } from 'react-icons/ri'
import { TbPictureInPictureOff, TbPictureInPictureOn } from 'react-icons/tb'	
import { useState, useRef, useEffect } from 'react'

export default function VideoPlayer({ src }) {

	const [playing, setPlaying] = useState(false)
	const [pictureInPicture, setPictureInPicture] = useState(false)
	const [theater, setTheater] = useState(false)
	const [fullscreen, setFullscreen] = useState(false)
	const video = useRef(null)
	const videoContainer = useRef(null)

	const togglePlayPause = () => {
		setPlaying(prev => { return !prev })
		if (video.current) {
			!playing ? video.current.play() : video.current.pause()
		}
	}

	const togglePictureInPicture = () => {
		setTheater(false)
		setFullscreen(false)
		setPictureInPicture(prev => { return !prev })
		if (!pictureInPicture) {
			video.current.requestPictureInPicture()
		} else {
			document.exitPictureInPicture()
		}
	}

	const toggleTheater = () => {
		setTheater(prev => { return !prev })
		videoContainer.current.className = !theater ? "video-container theater" : "video-container";
	}

	const _setFullscreen = (fullscreen) => {
		setFullscreen(!fullscreen)
		if (!fullscreen) {
			videoContainer.current.requestFullscreen()
		} else {
			document.exitFullscreen()
		}
		videoContainer.current.className = !fullscreen ? "video-container fullscreen" : "video-container";
	}

	useEffect(() => {
		const keydownEvents = (e) => {

			// If user is typing in the comments, return
			const tagName = document.activeElement.tagName.toLowerCase()
			if (tagName === 'input') { return }

			e.preventDefault()
			switch (e.key.toLowerCase()) {
				case " ":
					if (tagName === 'button') { return }
				case "k":
					// console.log(`toggle play/pause: ${playing}`)
					togglePlayPause()
					break
				case "i":
					togglePictureInPicture()
					break
				case "t":
					toggleTheater()
					break
				case "f":
					_setFullscreen(fullscreen)
					break
				case "escape":
					_setFullscreen(true)
					break
			}
		}
		// console.log('add keydownEvents')
		document.addEventListener("keydown", keydownEvents)

		return () => {
			// console.log('remove keydownEvents')
			document.removeEventListener("keydown", keydownEvents)
		}
	}, [playing, fullscreen, pictureInPicture, theater])

	return (
		<div className="video-container" ref={videoContainer}>
			<div className="video-controls-container">
				<div className="timeline-container"></div>
				<div className="controls">
					<button className="play-pause-btn" onClick={togglePlayPause}>
						{!playing && <BsFillPlayFill aria-hidden="true"/>}
						{playing && <BsFillPauseFill aria-hidden="true"/>}
					</button>
					<button className="picture-in-picture-btn" onClick={togglePictureInPicture}>
						{!pictureInPicture && <TbPictureInPictureOn aria-hidden="true"/>}
						{pictureInPicture && <TbPictureInPictureOff aria-hidden="true"/>}
					</button>
					<button className="theater-btn" onClick={toggleTheater}>
						{!theater && <MdOutlinePanoramaWideAngle aria-hidden="true"/>}
						{theater && <MdOutlinePanoramaWideAngleSelect aria-hidden="true"/>}
					</button>
					<button className="fullscreen-btn" onClick={() => _setFullscreen(fullscreen) }>
						{fullscreen && <RiFullscreenExitLine aria-hidden="true"/>}
						{!fullscreen && <RiFullscreenFill aria-hidden="true"/>}
					</button>
				</div>
			</div>
			<video src={ src } ref={video} onClick={togglePlayPause}></video>
		</div>
	)
}