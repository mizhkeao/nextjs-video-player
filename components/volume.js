import { IoIosVolumeOff, IoMdVolumeMute, IoMdVolumeLow, IoMdVolumeHigh  } from 'react-icons/io'

export default function Volume({ ToggleMute, OnVolumeChange, muted, volume }) {

	return (
		<div className="volume-container">
			<button className="volume-btn" onClick={ ToggleMute }>
				{muted && <IoIosVolumeOff aria-hidden="true"/>}
				{!muted && volume == 0 && <IoMdVolumeMute aria-hidden="true"/>}
				{!muted && volume <= 0.5 && volume > 0 && <IoMdVolumeLow aria-hidden="true"/>}
				{!muted && volume > 0.5 && <IoMdVolumeHigh aria-hidden="true"/>}
			</button>
			<input className='volume-slider' type='range' min='0' max='1' step='any' value={ muted ? 0 : volume } onChange={ OnVolumeChange }></input>
		</div>
	)
}