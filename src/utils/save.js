/*
 * 文件本地保存工具
 *
 * 参数:
 * data: 文件数据
 * fileName: 文件名
 * 
 * 注: 通过创建a标签并点击事件触发文件下载
 */


export const saveFileToLocal = (data, fileName) => {
    const blob = new Blob([data])
    const elink = document.createElement('a')
    elink.download = fileName
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href)
    document.body.removeChild(elink)
}