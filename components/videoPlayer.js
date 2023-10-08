
import { BsFillPlayFill, BsFillPauseFill  } from 'react-icons/bs'
import { MdOutlinePanoramaWideAngle, MdOutlinePanoramaWideAngleSelect  } from 'react-icons/md'
import { RiFullscreenExitLine, RiFullscreenFill  } from 'react-icons/ri'
import { TbPictureInPictureOff, TbPictureInPictureOn } from 'react-icons/tb'
import { useState, useRef, useEffect } from 'react'
import Volume from './volume'
import { set } from 'date-fns'

export default function VideoPlayer({ src }) {

	const [playing, setPlaying] = useState(false)
	const [pictureInPicture, setPictureInPicture] = useState(false)
	const [theater, setTheater] = useState(false)
	const [fullscreen, setFullscreen] = useState(false)
	const [volume, setVolume] = useState(1.0)
	const [muted, setMuted] = useState(false)

	const video = useRef(null)
	const videoContainer = useRef(null)

	const [videoCurrentTime, setVideoCurrentTime] = useState('0:00')
	const [videoTotalTime, setVideoTotalTime] = useState('0:00')

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
			const className = document.activeElement.className 
			if (tagName === 'input' && className != 'volume-slider') { return }

			switch (e.key.toLowerCase()) {
				case " ":
					e.preventDefault()
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
				case "m":
					ToggleMute()
					break
				case "escape":
					_setFullscreen(true)
					break
				case 'j':
				case "arrowleft":
					skipDuration(-5)
					break
				case 'l':
				case "arrowright":
					skipDuration(5)
					break
			}
		}
		// console.log('add keydownEvents')
		document.addEventListener("keydown", keydownEvents)

		// const video = document.getElementById("video")
		// const loadedMetadata = (e) => {
		// 	console.log('loadedmetadata')
		// 	setVideoTotalTime(formatDuration(video.duration))
		// }
		// video.addEventListener('loadedmetadata', loadedMetadata)

		return () => {
			// console.log('remove keydownEvents')
			document.removeEventListener("keydown", keydownEvents)
			// video.removeEventListener("loadedmetadata", loadedMetadata)
		}
	}, [playing, fullscreen, pictureInPicture, theater, muted])

	const leadingZeroFormatter = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 })

	const formatDuration = (time) => {
		const seconds = Math.floor(time % 60)
		const minutes = Math.floor(time / 60) % 60
		const hours = Math.floor(time / 3600)
		if (hours === 0) {
			return `${minutes}:${leadingZeroFormatter.format(seconds)}`
		}
	}

	const skipDuration = (duration) => {
		if (video.current) {
			video.current.currentTime += duration
		}
	}

	const ToggleMute = () => {
		setMuted(!muted)
		if (!muted) {
			video.current.volume = 0
		} else {
			video.current.volume = volume
		}
	}

	const OnVolumeChange = (e) => {
		setVolume(e.target.value)
		setMuted(false)
		video.current.volume = e.target.value
	}

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
					<Volume ToggleMute={ToggleMute} OnVolumeChange={OnVolumeChange} muted={muted} volume={volume}></Volume>
					<div className="duration-container">
						<div className="current-time">{videoCurrentTime}</div>
						/
						<div className="total-time">{videoTotalTime}</div>
					</div>
				</div>
			</div>
			<video src={ src } ref={video} onClick={togglePlayPause} onLoadedMetadata={(e) => {
				console.log("onLoadedMetadata")
				setVideoTotalTime(formatDuration(e.currentTarget.duration))
			}} onTimeUpdate={(e) => {
				console.log('OnTimeUpdate')
				setVideoTotalTime(formatDuration(e.currentTarget.duration))
				setVideoCurrentTime(formatDuration(e.currentTarget.currentTime))
			}}/>
		</div>
	)
}
