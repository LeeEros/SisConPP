import Wave from 'react-wavify';

const WaveFooter = () => (
  <div style={{ position: 'fixed', bottom: 0, width: '100%', height: '150px' }}>
    <Wave
      fill='#3A6A00' 
      paused={false}
      style={{ 
        display: 'flex',
        position: 'absolute',
        bottom: 0,
        width: '100%'
      }}
      options={{
        height: 120,
        amplitude: 60,
        speed: 0.15,
        points: 4
      }}
    />
    <Wave
      fill='#CE3F60' 
      paused={false}
      style={{ 
        display: 'flex',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        opacity: 0.9
      }}
      options={{
        height: 130, 
        amplitude: 50,
        speed: 0.2,
        points: 3
      }}
    />
  </div>
)

export default WaveFooter;