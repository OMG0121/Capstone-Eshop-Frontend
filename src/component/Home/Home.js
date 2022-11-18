import Header from "../../common/Header/Header";

export default function Home(props) {
    return (
      <Header loginModal={props.loginModal} baseURL={props.baseURL} regitersModal={props.regitersModal}/>
    );
}