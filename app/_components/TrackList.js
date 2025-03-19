function TrackList({ tracks }) {
  return (
    <div className="text-accent-200">
      <ul>
        {tracks.map((track) => (
          <li key={track.number}>
            {track.number} - {track.title} {track.length}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TrackList;
