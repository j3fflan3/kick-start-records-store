function TrackList({ tracks }) {
  return (
    <div className="text-accent-50 mt-4">
      <p className="text-xl font-bold text-primary-400">Track List</p>
      <ul>
        {tracks.map((track) => (
          <li key={track.number}>
            {track.number} - {track.title}{" "}
            <span className="text-md text-primary-400">
              Length: {track.length}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TrackList;
