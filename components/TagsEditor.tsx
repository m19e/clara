import { useState, useRef, ReactElement } from "react";
import AutosizeInput from "react-input-autosize";
import TagsInput from "react-tagsinput";
import { useR18 } from "../store/novel";

const autoSizingRenderInput = ({ addTag, ...props }: TagsInput.RenderInputProps) => {
    let { onChange, value, ...other } = props;
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
        <span key={key} {...other} className="inline-block text-sm font-normal rounded editor-bg mr-1 mb-1 px-1.5 py-1" style={{ fontFamily: "sans-serif" }}>
            {getTagDisplayValue(tag)}
            {!disabled && (
                <a className="ml-1 text-gray-400 font-bold cursor-pointer" onClick={() => onRemove(key)}>
                    ×
                </a>
            )}
        </span>
    );
};

const defaultRenderLayout = (tagComponents: ReactElement[], inputComponent: ReactElement) => {
    return (
        <span>
            {tagComponents}
            {inputComponent}
        </span>
    );
};

const TagsEditor = ({ tempTags }: { tempTags: string[]; setTempTags: (tags: string[]) => void }) => {
    const [tags, setTags] = useState(tempTags);
    const [tag, setTag] = useState("");
    const [suggests, setSuggests] = useState([
        "アイドルマスターシャイニーカラーズ",
        "放クラ",
        "小宮果穂",
        "園田智代子",
        "西城樹里",
        "杜野凛世",
        "有栖川夏葉",
        "ノクチル",
        "浅倉透",
        "樋口円香",
        "福丸小糸",
        "市川雛菜",
    ]);
    const [r18, setR18] = useR18();
    const [tempR18, setTempR18] = useState(r18);
    const inputRef = useRef<TagsInput<any>>();
    const reg = /[^_0-9a-zA-Z\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+/g;

    const handleChange = (tags: any[]) => {
        const valid = tags.map((t: string) => t.replace(reg, "")).filter((t: string) => t !== "");
        setTags(valid);
    };

    const handleChangeInput = (t: string) => {
        if (/[\s]/.test(t)) {
            inputRef.current?.accept();
            return;
        }
        if (Array.from(t).length >= 30) {
            setTag(Array.from(t).slice(0, 30).join(""));
            return;
        }
        setTag(t);
    };

    const handleClickSuggest = (suggest: string) => {
        inputRef.current?.addTag(suggest);
        inputRef.current?.focus();
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="w-full flex justify-between text-sm">
                <span className="mx-2.5" style={{ fontFamily: "sans-serif" }}>
                    タグ
                </span>
                <span className="mx-2.5">{tags.length}/10</span>
            </div>
            <TagsInput
                ref={inputRef}
                value={tags}
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
            <div className="w-full mt-2 p-2 flex flex-col bg-gray-100 rounded" style={{ fontFamily: "sans-serif" }}>
                <div className="flex flex-wrap">
                    {suggests.map((s) => (
                        <span className="mr-2 text-sm text-gray-500 hover:text-blue-400 cursor-pointer" onClick={() => handleClickSuggest(s)}>
                            {s}
                        </span>
                    ))}
                </div>
            </div>
            <div className="w-full mt-2 p-2 inline-flex items-center justify-between bg-gray-100 rounded">
                <span className="text-sm">R-18</span>
                <span className="relative cursor-pointer" onClick={() => setTempR18((prev) => !prev)}>
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
