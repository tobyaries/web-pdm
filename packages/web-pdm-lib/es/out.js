import React, { useEffect, useState } from 'react';
import { applySnapshot, withoutUndo } from 'mobx-keystone';
import { useMst } from './context';
import { observer } from 'mobx-react-lite';
import { Provider, createRootStore } from './context';
import MSTPage from './components';
export * from './type/config';
const Page = observer(({ onIntl, onReload, onModelDetail, models, modules, erdkey, className, style, height, onIgnoreEdge, components, IconRenders }) => {
    const data = useMst();
    useEffect(() => {
        // onSnapshot(data, snapshot => {
        //     sessionStorage.setItem(
        //         'web-pdm' + erdkey,
        //         JSON.stringify(snapshot)
        //     )
        //     sessionStorage.setItem(
        //         'web-pdm-fields' + erdkey,
        //         JSON.stringify(Array.from(data.Fields.entries()))
        //     )
        // })
        const localdata = sessionStorage.getItem('web-pdm' + erdkey);
        if (!localdata) {
            withoutUndo(() => data.initData(models, modules));
        }
        else {
            const sdata = JSON.parse(localdata);
            sdata.sys.height = height;
            withoutUndo(() => {
                const localFieldsdata = sessionStorage.getItem('web-pdm-fields' + erdkey);
                if (localFieldsdata) {
                    data.setFields(new Map(JSON.parse(localFieldsdata)));
                }
                applySnapshot(data, sdata);
                data.sys.setOnIgnoreEdge(onIgnoreEdge);
                data.sys.setOnModelDetail(onModelDetail);
                data.Ui.registComponents(components, IconRenders);
                data.setOnReload(onReload);
                data.onIntl = onIntl;
            });
        }
    }, []);
    useEffect(() => {
        data.Models.clear();
        data.Modules.clear();
        data.Fields.clear();
        withoutUndo(() => data.initData(models, modules));
    }, [models]);
    return React.createElement(MSTPage, { className: className, style: style });
});
/**
 *组件定义
 *
 * @param {*} props 属性接口
 * @return {*}
 */
const WebPDM = props => {
    const [rootStore] = useState(() => {
        return createRootStore({
            sys: {
                height: props.height,
                onIgnoreEdge: props.onIgnoreEdge,
                onModelDetail: props.onModelDetail,
                intl: props.intl,
                onlyMode: props.onlyMode
            },
            Ui: {
                themeColor: props.themeColor,
                darkness: props.darkness
            },
            components: props.components,
            onReload: props.onReload,
            onIntl: props.onIntl,
            IconRenders: props.IconRenders,
            disableIcons: props.disableIcons
        });
    });
    return (React.createElement(Provider, { value: rootStore }, rootStore && React.createElement(Page, Object.assign({}, props))));
};
export default WebPDM;
