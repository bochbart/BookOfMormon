import { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
//
import { assetUrl } from 'src/models/BoMOnlineAPI';
import BoMOnlineAPI from "src/models/BoMOnlineAPI"


export default function MapTypes({ getMap, mapName }) {
    const [isShow, setIsShow] = useState(false),
        [mapList, setMapList] = useState(null),
        activeMap = mapList?.find(map => map.name === mapName);

    useEffect(() => {
        getMapList()
    }, [])

    const getMapList = () => {
        BoMOnlineAPI({ maplist: true }).then((result) => {
            setMapList(result.maplist)
        })
    }

    const handleClickMapType = (mapSlug) => {
        setIsShow(false)
        getMap(mapSlug, null)
    }

    return (
        <div className='map-right-arrow noselect'>
            {activeMap ? <div
                className={`map-type-active ${isShow ? "active" : ""}`}
                onClick={() => { ReactTooltip.hide();setIsShow(!isShow)}}
                data-tip={`<div class='mapType'><img src='${assetUrl}/map/${activeMap?.slug}/${activeMap?.slug}'><p>${activeMap?.desc}</p><div>`}
                data-for='activemapselect'
            >
                {mapName}{" "}
                <i className='fa fa-caret-down fa-rotate' aria-hidden='true' />
                <ReactTooltip
                    html={true}
                    id='activemapselect'
                    place='right'
                    effect='solid'
                    className='react-component-tooltip'
                />
            </div>
                : <></>}

            <div className='maptypes noselect' style={{ display: isShow ? "block" : "none" }}>
                {mapList?.map((map, index) => {
                    if (map.zoom < 0) return null;
                    const img = new Image();
                    img.src = `${assetUrl}/map/${map.slug}/${map.slug}`;
                    return mapName !== map.name
                        ? <div
                            data-tip={`<div class='mapType'><img src='${assetUrl}/map/${map.slug}/${map.slug}'><p>${map.desc}</p><div>`}
                            data-for='mapselect'
                            key={index}
                            className='map-type'
                            onClick={() => handleClickMapType(map.slug)}
                        >
                            {map.name}
                        </div>
                        : <></>
                })}
            </div>
            {mapList ? <ReactTooltip
                html={true}
                id='mapselect'
                place='right'
                effect='solid'
                className='react-component-tooltip'
            /> : <></>
            }
        </div>
    )
}
