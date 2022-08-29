import './styles.scss';

interface PropTypes {
    totalHits: number;
    currentPage: number;
    itemsPerPage: number;
    invertedColors?: boolean;
    onChange(idx: number): void;
}

export default function Paginator(props: PropTypes) {
    const firstPage = 0;
    const pageIndexesVisible = 9;
    const totalPages = Math.ceil(props.totalHits / props.itemsPerPage);

    const renderPageButtons = () => {
        const pagination = [];
        let startIndex = props.currentPage - 4;
        startIndex = startIndex < (totalPages - pageIndexesVisible) 
            ? startIndex 
            : totalPages - pageIndexesVisible;
        startIndex = startIndex < firstPage ? firstPage : startIndex;

        let endIndex = startIndex + pageIndexesVisible;
        endIndex = endIndex > totalPages ? totalPages : endIndex;
        for (let i = startIndex; i < endIndex; i++) {
            pagination.push(
                <button
                    key={i}
                    onClick={() => props.onChange(i)}
                    className={i === props.currentPage ?
                        "active paginate-button btn" :
                        "paginate-button btn"
                    }
                >
                    {i + 1}
                </button>
            );
        }

        return pagination;
    };

    return (
        <div 
            className={
                "paginator-container" + 
                (props.invertedColors ? " inverted" : "")
            }
        >
            <div className="paginator">
                <button
                    className="prev paginate-button"
                    disabled={props.currentPage <= firstPage}
                    onClick={() => props.onChange(props.currentPage - 1)}
                >
                    {"<<"} <span className="desktop-only">PREV</span>
                </button>
                {renderPageButtons()}
                <button
                    className="next paginate-button"
                    disabled={props.currentPage >= totalPages - 1}
                    onClick={() => props.onChange(props.currentPage + 1)}
                >
                    <span className="desktop-only">NEXT</span> {">>"}
                </button>
            </div>
        </div>
    );
}