type TagsEditModalProps = {
    tags: string[];
    setTags: (tags: string[]) => void;
};

const NovelTagsEditModal = () => (
    <span className="text-gray-400 hover:text-gray-600 w-4 h-4 mb-1 mr-0.5 flex-center cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
    </span>
);

export default NovelTagsEditModal;
