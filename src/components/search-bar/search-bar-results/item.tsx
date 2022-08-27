import musicIcon from "../../../assets/icons/music.svg";

export interface PropTypes {
    title: string;
    subtitle?: string;
    thumbnail?: string;
    onClick(): void;
}

export default function SearchBarResultsItem(props: PropTypes) {
    return (
        <div className="result-item" onClick={props.onClick}>
            <div className="image-container">
                <img src={props.thumbnail || musicIcon} alt="thumbnail" />
            </div>
            <div className="data-container">
                <div className="title">{props.title}</div>
                <div className="subtitle">{props.subtitle}</div>
            </div>            
        </div> 
    );
}