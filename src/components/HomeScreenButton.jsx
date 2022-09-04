function HomeScreenButton(props) {
  return (
    <a href={props.link}>
      <button className="rounded-3xl shadow-lg text-center px-6 py-6 mx-auto flex gap-3 w-80 bg-green-100 hover:bg-green-300">
        <div className="flex gap-3 mx-auto">
          <span className="my-auto">{props.icon}</span>
          <h1 className="font-bold text-center text-2xl">{props.text}</h1>
        </div>
      </button>
    </a>
  );

  //hello world
}

export default HomeScreenButton;
