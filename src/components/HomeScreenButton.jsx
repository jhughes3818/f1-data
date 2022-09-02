function HomeScreenButton(props) {
    return (
        <button className="bg-white rounded-lg text-center px-6 py-6 mx-auto flex gap-3 w-80">
          <div className="flex gap-3 mx-auto">
            <span className="my-auto">{props.icon}</span>
            <h1 className="font-bold text-center text-2xl">{props.text}</h1>
          </div>
        </button>
    )


    //hello world

}

export default HomeScreenButton