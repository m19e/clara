import { useState, useRef, ReactElement } from "react";
import AutosizeInput from "react-input-autosize";
import TagsInput from "react-tagsinput";
import { useSuggests } from "store/novel";

const autoSizingRenderInput = ({ addTag, ...props }: TagsInput.RenderInputProps) => {
    const { onChange, value, ...other } = props;
    return (
        <AutosizeInput
            type="text"
            {...other}
            placeholder="タグを追加"
            style={{ fontFamily: "sans-serif" }}
            inputClassName="bg-transparent border-0 text-sm font-normal ml-1.5 mt-1.5 mb-2 outline-none focus:outline"
            onChange={onChange}
            value={value}
        />
    );
};

const customRenderTag = (props: TagsInput.RenderTagProps) => {
    const { tag, key, disabled, onRemove, className, classNameRemove, getTagDisplayValue, ...other } = props;
    return (
        <span key={key} {...other} className="inline-flex text-sm font-normal rounded editor-bg mr-1 mb-1 pl-1.5 py-1" style={{ fontFamily: "sans-serif" }}>
            {getTagDisplayValue(tag)}
            {!disabled && (
                <a className="ml-0.5 mr-1 pb-0.5 flex-center text-gray-400 transition-colors hover:text-gray-600" onClick={() => onRemove(key)}>
                    <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </a>
            )}
        </span>
    );
};

const defaultRenderLayout = (tagComponents: ReactElement[], inputComponent: ReactElement) => (
    <span>
        {tagComponents}
        {inputComponent}
    </span>
);

type Props = {
    tempTags: string[];
    setTempTags: (tags: string[]) => void;
    tempR18: boolean;
    setTempR18: (flag: boolean) => void;
};

const TagsEditor = ({ tempTags, setTempTags, tempR18, setTempR18 }: Props) => {
    const [tag, setTag] = useState("");
    const inputRef = useRef<TagsInput<any>>();
    const reg = /[^_0-9a-zA-Z\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+/g;

    const [suggests] = useSuggests();
    const sortedSuggests = suggests.slice().sort((cur, next) => next.count - cur.count);

    const handleChange = (tags: any[]) => {
        const valid = tags.map((t: string) => t.replace(reg, "")).filter((t: string) => t !== "");
        setTempTags(valid);
    };

    const handleChangeInput = (t: string) => {
        if (/[\s]/.test(t)) {
            inputRef.current?.accept();
            return;
        }
        const array = Array.from(t);
        if (array.length >= 30) {
            setTag(array.slice(0, 30).join(""));
            return;
        }
        setTag(t);
    };

    const handleClickSuggest = (s: string) => {
        inputRef.current?.addTag(s);
        inputRef.current?.focus();
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="w-full flex justify-between text-sm">
                <span className="mx-2.5" style={{ fontFamily: "sans-serif" }}>
                    タグ
                </span>
                <span className="mx-2.5">{tempTags.length}/10</span>
            </div>
            <TagsInput
                ref={inputRef}
                value={tempTags}
                onChange={handleChange}
                inputValue={tag}
                onChangeInput={handleChangeInput}
                className="w-full pt-1 pl-1 overflow-hidden rounded bg-gray-100"
                renderTag={customRenderTag}
                renderInput={autoSizingRenderInput}
                renderLayout={defaultRenderLayout}
                onlyUnique={true}
                maxTags={10}
            />
            {sortedSuggests.length !== 0 && (
                <div className="w-full mt-2 p-2 flex flex-col bg-gray-100 rounded" style={{ fontFamily: "sans-serif" }}>
                    <div className="flex flex-wrap">
                        {sortedSuggests.map((s, i) => (
                            <span key={i} className="mr-2 text-sm text-gray-500 hover:text-blue-400 cursor-pointer" onClick={() => handleClickSuggest(s.name)}>
                                {s.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            <div className="w-full mt-2 p-2 inline-flex items-center justify-between bg-gray-100 rounded">
                <span className="text-sm">R18</span>
                <span className="relative cursor-pointer" onClick={() => setTempR18(!tempR18)}>
                    <span className={"block w-10 h-6 bg-gray-200 rounded-full shadow-inner transition-colors" + (tempR18 ? " bg-red-500" : "")}></span>
                    <span
                        className={
                            "absolute block w-4 h-4 mt-1 ml-1 bg-white rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out" +
                            (tempR18 ? " transform translate-x-full" : "")
                        }
                    ></span>
                </span>
            </div>
        </div>
    );
};

export default TagsEditor;
