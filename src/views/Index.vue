<template>
  <div>
    <el-container>
      <!-- 头部区域 -->
      <el-header height="auto">
        <el-menu
            ref="menu"
            class="el-menu-1"
            mode="horizontal"
            :ellipsis="false"
            style="min-width: 100%;"
        >
          <!-- 左侧LOGO信息 -->
          <el-menu-item>
            <h1>NullBot <el-icon size="25">
              <MostlyCloudy />
            </el-icon></h1>
          </el-menu-item>

          <!-- 中部功能相关 -->
          <div class="header-center" style="margin-bottom: 8px; flex: 1; display: flex; align-items: center; justify-content: center;">
            <!-- op=1时 显示搜索功能 -->
            <div v-show="op === 1" class="search-container" style="display: flex; align-items: center; gap: 10px; width: 100%; max-width: 700px; padding: 0 0;">
              <el-icon size="20"><Files /></el-icon>
              <el-input
                  placeholder="在此目录中搜索"
                  v-model="searchKey"
                  clearable
                  style="flex: 1; min-width: 20px;"
              >
              </el-input>

              <el-button plain @click="searchFile">
                <el-icon size="15"><Search /></el-icon>&nbsp;搜索
              </el-button>
            </div>
            <!-- op=2时 显示问候 -->
            <h3 v-show="op === 2" style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; white-space: nowrap">
              <span>Ciallo～(∠・ω< ) <span style="font-weight: bold;">{{ currentTime }}</span> ⌒☆</span>
            </h3>
            <!-- op=3时 显示语录管理 -->
            <h3 v-show="op === 3" style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center;">
              <el-icon><ChatDotSquare /></el-icon>语录管理
            </h3>

            <!-- op=4时 显示数据统计 -->
            <h3 v-show="op === 4" style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center;">
              <el-icon><Histogram /></el-icon>数据统计
            </h3>

            <!-- op=5时 显示用户管理 -->
            <h3 v-show="op === 5" style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center;">
              <el-icon><Cellphone /></el-icon>用户管理
            </h3>

            <!-- op=6时 显示群组管理 -->
            <h3 v-show="op === 6" style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center;">
              <el-icon><OfficeBuilding /></el-icon>群组管理
            </h3>

            <!-- op=7时 显示物品管理 -->
            <h3 v-show="op === 7" style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center;">
              <el-icon><Box /></el-icon>物品管理
            </h3>
          </div>

          <!-- 右侧用户信息 -->
          <el-sub-menu style="margin-left: auto;">
            <div style="padding: 10px; margin-bottom: 2px">
              <div style="display: flex; align-items: center; gap: 10px;">
                <el-avatar
                    :size="40"
                    :src="info.avatar"
                    style="background-color: #433d3d;"
                >
                  <template #default>
                    <el-icon size="20px"><User /></el-icon>
                  </template>
                </el-avatar>
                <div style="flex: 1; min-width: 0;">
                  <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">{{ info.username || '未设置' }}</div>
                  <div style="font-size: 12px">
                    {{ this.userType === 0 ? '访客' : '管理员' }}
                  </div>
                </div>
              </div>
            </div>

            <el-menu-item style="background-color: transparent !important; --el-menu-hover-bg-color: transparent;">
              <el-button :disabled="userType === 0" type="warning" plain style="width: 100%; justify-content: center;" @click="initRootFile">
                <el-icon size="15"><Coin /></el-icon>根初始化
              </el-button>
            </el-menu-item>
            <el-menu-item style="background-color: transparent !important; --el-menu-hover-bg-color: transparent;">
              <el-button type="primary" plain style="width: 100%; justify-content: center;" @click="sync">
                <el-icon size="15"><Switch /></el-icon>数据同步
              </el-button>
            </el-menu-item>
            <el-menu-item style="background-color: transparent !important; --el-menu-hover-bg-color: transparent;">
              <el-button type="danger" plain style="width: 100%; justify-content: center;" @click="logout">
                <el-icon size="15"><SwitchButton /></el-icon>退出登录
              </el-button>
            </el-menu-item>
            <template #title>
              <el-icon><User /></el-icon>
              <el-text size="large" tag="b">&nbsp;{{ info.username || '未设置' }}</el-text>
            </template>
          </el-sub-menu>
        </el-menu>
      </el-header>

      <el-container>
        <!-- 左侧导航区域 -->
        <el-aside style="width: 10%; min-width: 150px;">
          <el-menu
              ref="menu"
              default-active="1"
              class="el-menu-2"
              :ellipsis="false"
              style="min-width: 100%;"
          >
            <h3 align="center"><el-icon>
              <Promotion />
            </el-icon>&nbsp;导航</h3>
            <el-menu-item
                index="1"
                @click="shiftMenu(1)"
                style="display: flex; justify-content: center; align-items: center;"
            >
              <span><el-icon><Files /></el-icon>文件管理</span>
            </el-menu-item>
            <el-menu-item
                index="3"
                @click="shiftMenu(3)"
                style="display: flex; justify-content: center; align-items: center;"
            >
              <span><el-icon><ChatDotSquare /></el-icon>语录管理</span>
            </el-menu-item>
            <el-menu-item
                index="5"
                @click="shiftMenu(5)"
                style="display: flex; justify-content: center; align-items: center;"
            >
              <span><el-icon><Cellphone /></el-icon>用户管理</span>
            </el-menu-item>
            <el-menu-item
                index="6"
                @click="shiftMenu(6)"
                style="display: flex; justify-content: center; align-items: center;"
            >
              <span><el-icon><OfficeBuilding /></el-icon>群组管理</span>
            </el-menu-item>
            <el-menu-item
                index="7"
                @click="shiftMenu(7)"
                style="display: flex; justify-content: center; align-items: center;"
            >
              <span><el-icon><Box /></el-icon>物品管理</span>
            </el-menu-item>
            <el-menu-item
                index="4"
                @click="shiftMenu(4)"
                style="display: flex; justify-content: center; align-items: center;"
            >
              <span><el-icon><Histogram /></el-icon>数据统计</span>
            </el-menu-item>
            <el-menu-item
                index="2"
                @click="shiftMenu(2)"
                style="display: flex; justify-content: center; align-items: center;"
            >
              <span><el-icon><UserFilled /></el-icon>个人中心</span>
            </el-menu-item>
            <el-menu-item
                index="8"
                v-if="userType === 1"
                @click="shiftMenu(8)"
                style="display: flex; justify-content: center; align-items: center;"
            >
              <span><el-icon><Platform /></el-icon>系统调用</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <!-- 右侧内容区域 -->
        <el-container style="height: 100%;">
            <!-- 文件管理头部 -->
            <el-header v-show="op === 1" height="20px" style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; padding-right: 5px">
                <el-icon size="20">
                  <HomeFilled />
                </el-icon>
                <el-text size="large">{{ " "+curDir }}&nbsp;</el-text>
                <el-button type="text" title="复制路径" @click="copyCurDir"><el-icon size="15"><DocumentCopy /></el-icon></el-button>
              </div>

              <!-- 文件操作按钮 -->
              <!--<div class="custom-scrollbar" style="display: flex; align-items: center; overflow-x: auto; overflow-y: visible">-->
              <div style="display: flex; align-items: center;">
                <el-upload
                    multiple
                    ref="upload"
                    class="upload"
                    action=""
                    :file-list="uploadFileList"
                    :on-change="handleFileChange"
                    :on-remove="handleFileChange"
                    :auto-upload="false"
                    style="display: inline-flex; padding-left: 5px"
                >
                  <template #trigger>
                    <el-button type="primary" plain :disabled="uploading || userType === 0">
                      <el-icon size="15"><DocumentAdd /></el-icon>&nbsp;{{uploading ? uploadFilesTotal + "/" + uploadFileList.length : "添加文件"}}
                    </el-button>
                  </template>
                </el-upload>

                <el-button class="ml-1" type="success" plain @click="upload" :loading="uploading" :disabled="userType === 0">
                  <el-icon v-if="!uploading" size="15"><UploadFilled /></el-icon>&nbsp;{{uploading ? "处理中..." : "上传"}}
                </el-button>

                <el-button-group style="margin-left: 15px; margin-right: 1px;display: inline-flex;">
                  <el-button round plain @click="backDir">
                    <el-icon size="15"><RefreshLeft /></el-icon>&nbsp;返回上级
                  </el-button>
                  <el-button round plain @click="createDir" :disabled="userType === 0">
                    <el-icon size="15"><FolderAdd /></el-icon>&nbsp;新建目录
                  </el-button>
                </el-button-group>
              </div>
            </el-header>

          <!-- 语录管理头部 -->
          <el-header v-show="op === 3" height="20px" style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; flex: 1; min-width: 0; margin-right: 20px; overflow: hidden;">
              <el-icon size="18px"><Filter /></el-icon>&nbsp;
              <el-form :inline="true" style="display: flex; width: 70%; gap: 0; align-items: center; flex-wrap: nowrap; justify-content: flex-start;">
                <el-form-item label="过滤器" style="margin: 0; flex-shrink: 0; white-space: nowrap;">
                </el-form-item>

                <el-form-item style="margin: 0; flex: 2;  min-width: 310px; max-width: 740px">
                  <el-input
                      placeholder="请输入关键字..."
                      :prefix-icon="Search"
                      v-model="sayingSearchKey"
                      clearable
                      style="width: 100%"
                  >
                  </el-input>
                </el-form-item>
              </el-form>
            </div>

            <!-- 语录操作按钮 -->
            <div style="display: flex; align-items: center; flex-shrink: 0;">
              <el-button-group style="display: inline-flex; margin-right: 1px">
                <el-button round plain @click="sayingImportVisible = true" :disabled="userType === 0">
                  <el-icon size="15"><DocumentAdd /></el-icon>&nbsp;导入语录
                </el-button>
                <el-button round plain @click="exportSayingCsv()" :disabled="userType === 0">
                  <el-icon size="15"><DocumentCopy /></el-icon>&nbsp;导出语录
                </el-button>
              </el-button-group>
            </div>
          </el-header>

          <!-- 用户管理头部 -->
          <el-header v-show="op === 5" height="20px" style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; flex: 1; min-width: 0; margin-right: 20px; overflow: hidden;">
              <el-icon size="18px"><Filter /></el-icon>&nbsp;
              <el-form :inline="true" style="display: flex; width: 70%; gap: 0; align-items: center; flex-wrap: nowrap; justify-content: flex-start;">
                <el-form-item label="过滤器" style="margin: 0; flex-shrink: 0; white-space: nowrap;">
                </el-form-item>

                <el-form-item style="margin: 0; flex: 2;  min-width: 310px; max-width: 740px">
                  <el-input
                      placeholder="请输入关键字..."
                      :prefix-icon="Search"
                      v-model="userSearchKey"
                      clearable
                      style="width: 100%"
                  >
                  </el-input>
                </el-form-item>
              </el-form>
            </div>

            <!-- 用户操作按钮 -->
            <div style="display: flex; align-items: center; flex-shrink: 0;">
              <el-button-group style="display: inline-flex; margin-right: 1px">
                <el-button round plain @click="inventoryImportVisible = true" :disabled="userType === 0">
                  <el-icon size="15"><DocumentAdd /></el-icon>&nbsp;导入库存
                </el-button>
                <el-button round plain @click="exportInventoryCsv()" :disabled="userType === 0">
                  <el-icon size="15"><DocumentCopy /></el-icon>&nbsp;导出库存
                </el-button>
                <el-button round plain @click="userImportVisible = true" :disabled="userType === 0">
                  <el-icon size="15"><DocumentAdd /></el-icon>&nbsp;导入用户
                </el-button>
                <el-button round plain @click="exportUserCsv()" :disabled="userType === 0">
                  <el-icon size="15"><DocumentCopy /></el-icon>&nbsp;导出用户
                </el-button>
              </el-button-group>
            </div>
          </el-header>

          <!-- 群组管理头部 -->
          <el-header v-show="op === 6" height="20px" style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; flex: 1; min-width: 0; margin-right: 20px; overflow: hidden;">
              <el-icon size="18px"><Filter /></el-icon>&nbsp;
              <el-form :inline="true" style="display: flex; width: 70%; gap: 0; align-items: center; flex-wrap: nowrap; justify-content: flex-start;">
                <el-form-item label="过滤器" style="margin: 0; flex-shrink: 0; white-space: nowrap;">
                </el-form-item>

                <el-form-item style="margin: 0; flex: 2;  min-width: 310px; max-width: 740px">
                  <el-input
                      placeholder="请输入关键字..."
                      :prefix-icon="Search"
                      v-model="groupSearchKey"
                      clearable
                      style="width: 100%"
                  >
                  </el-input>
                </el-form-item>
              </el-form>
            </div>

            <!-- 群组操作按钮 -->
            <div style="display: flex; align-items: center; flex-shrink: 0;">
              <el-button-group style="display: inline-flex; margin-right: 1px">
                <el-button round plain @click="funcImportVisible = true" :disabled="userType === 0">
                  <el-icon size="15"><DocumentAdd /></el-icon>&nbsp;导入配置
                </el-button>
                <el-button round plain @click="exportFuncCsv()" :disabled="userType === 0">
                  <el-icon size="15"><DocumentCopy /></el-icon>&nbsp;导出配置
                </el-button>
                <el-button round plain @click="groupImportVisible = true" :disabled="userType === 0">
                  <el-icon size="15"><DocumentAdd /></el-icon>&nbsp;导入群组
                </el-button>
                <el-button round plain @click="exportGroupCsv()" :disabled="userType === 0">
                  <el-icon size="15"><DocumentCopy /></el-icon>&nbsp;导出群组
                </el-button>
              </el-button-group>
            </div>
          </el-header>

          <!-- 物品管理头部 -->
          <el-header v-show="op === 7" height="20px" style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; flex: 1; min-width: 0; margin-right: 20px; overflow: hidden;">
              <el-icon size="18px"><Filter /></el-icon>&nbsp;
              <el-form :inline="true" style="display: flex; width: 70%; gap: 0; align-items: center; flex-wrap: nowrap; justify-content: flex-start;">
                <el-form-item label="过滤器" style="margin: 0; flex-shrink: 0; white-space: nowrap;">
                </el-form-item>
                <el-form-item style="margin: 0; flex: 1; min-width: 80px; max-width: 140px">
                  <el-select
                      placeholder="All Types"
                      v-model="itemSearchCategory"
                      style="width: 100%"
                  >
                    <el-option label="ALL" :value="null" />
                    <el-option label="COMMON" :value="'COMMON'" />
                    <el-option label="SPECIAL" :value="'SPECIAL'" />
                    <el-option label="BREAD" :value="'BREAD'" />
                    <el-option label="LOOTING" :value="'LOOTING'" />
                  </el-select>
                </el-form-item>

                <el-form-item style="margin: 0; flex: 1; min-width: 80px; max-width: 140px">
                  <el-select
                      placeholder="All Rarity"
                      v-model="itemSearchRarity"
                      style="width: 100%"
                  >
                    <el-option label="ALL" :value="null" />
                    <el-option label="WHITE" :value="'WHITE'" />
                    <el-option label="GREEN" :value="'GREEN'" />
                    <el-option label="BLUE" :value="'BLUE'" />
                    <el-option label="PURPLE" :value="'PURPLE'" />
                    <el-option label="GOLD" :value="'GOLD'" />
                    <el-option label="RED" :value="'RED'" />
                  </el-select>
                </el-form-item>

                <el-form-item style="margin: 0; flex: 2;  min-width: 150px; max-width: 500px">
                  <el-input
                      placeholder="请输入关键字..."
                      :prefix-icon="Search"
                      v-model="itemSearchKey"
                      clearable
                      style="width: 100%"
                  >
                  </el-input>
                </el-form-item>
              </el-form>
            </div>

            <!-- 物品操作按钮 -->
            <div style="display: flex; align-items: center; flex-shrink: 0;">
              <el-button-group style="display: inline-flex; margin-right: 1px">
                <el-button round plain @click="itemImportVisible = true" :disabled="userType === 0">
                  <el-icon size="15"><DocumentAdd /></el-icon>&nbsp;导入物品
                </el-button>
                <el-button round plain @click="handleItemAdding()" :disabled="userType === 0">
                  <el-icon size="15"><Plus /></el-icon>&nbsp;新增物品
                </el-button>
                <el-button round plain @click="exportItemCsv()" :disabled="userType === 0">
                  <el-icon size="15"><DocumentCopy /></el-icon>&nbsp;导出物品
                </el-button>
              </el-button-group>
            </div>
          </el-header>

          <!-- 右侧主区域 -->
          <el-main style="height: 100%; width: 100%; overflow-y: auto; overflow-x: clip; padding: 20px;">
            <!-- 文件管理 -->
            <div v-show="op === 1">
              <el-table ref="fileTableData" :data="fileTableData" style="width: 100%" height="calc(100vh - 250px)">
                <template #empty>
                  <el-empty description="暂无文件"></el-empty>
                </template>

                <el-table-column type="index" label="序号" width="80" align="center"
                                 :index="(filePageInfo.current - 1) * filePageInfo.size + 1">
                </el-table-column>

                <el-table-column label="文件名" min-width="300" show-overflow-tooltip>
                  <template v-slot="scope">
                    <div style="display: flex; align-items: center;">
                      <el-icon v-if="scope.row.isDir === 1" style="margin-right: 8px;">
                        <Folder />
                      </el-icon>
                      <el-icon v-else style="margin-right: 8px;">
                        <Document />
                      </el-icon>

                      <!-- 文件名部分 -->
                      <span v-if="scope.row.isDir === 1" class="file-name-clickable"
                            @click="enterDir(scope.row)"
                            :title="`进入文件夹: ${scope.row.fileName}`"
                            style="cursor: pointer; color: #409eff; text-decoration: none;"
                            @mouseenter="e => e.target.style.textDecoration = 'underline'"
                            @mouseleave="e => e.target.style.textDecoration = 'none'"
                      >
                        {{ scope.row.fileName }}
                      </span>

                      <span v-else-if="isPreviewable(scope.row)" class="file-name-clickable"
                            @click="handlePreview(scope.row)"
                            :title="`预览文件: ${scope.row.fileName}`"
                            style="cursor: pointer; color: #67c23a; text-decoration: none;"
                            @mouseenter="e => e.target.style.textDecoration = 'underline'"
                            @mouseleave="e => e.target.style.textDecoration = 'none'"
                      >
                        {{ scope.row.fileName }}
                      </span>
                      <span v-else style="color: #cdd1da;">
                        {{ scope.row.fileName }}
                      </span>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column label="所有者" width="100" align="center" show-overflow-tooltip>
                  <template v-slot="scope">
                    {{ scope.row.ownerId != null ? (scope.row.ownerName ? `${scope.row.ownerName}(${scope.row.ownerId})` : `(${scope.row.ownerId})`) : '-' }}
                  </template>
                </el-table-column>

                <el-table-column label="修改日期" width="160" align="center">
                  <template v-slot="scope">
                    {{ scope.row.lastModified === null ? '-' : scope.row.lastModified.replace('T', ' ') }}
                  </template>
                </el-table-column>

                <el-table-column label="文件大小" width="100" align="center">
                  <template v-slot="scope">
                    {{ scope.row.isDir === 1 ? '-' : formatFileSize(scope.row.fileSize) }}
                  </template>
                </el-table-column>

                <el-table-column label="文件类型" width="100" align="center">
                  <template v-slot="scope">
                    <el-tag :type="scope.row.isDir === 1 ? 'info' : 'success'" style="min-width: 70px" effect="plain" round>
                      {{ scope.row.isDir === 1 ? '文件夹' : getFileExtension(scope.row.fileName) }}
                    </el-tag>
                  </template>
                </el-table-column>

                <el-table-column v-if="userType === 1" label="可见性" width="100" align="center">
                  <template v-slot="scope">
                    <el-switch v-model="scope.row.visible" inline-prompt :active-icon="Check" :inactive-icon="Close" style="--el-switch-on-color: rgba(218,62,113,0.95)"
                               :loading="scope.row._loading" :before-change="() => changeFileVisible(scope.row)"/>
                  </template>
                </el-table-column>

                <el-table-column fixed="right" label="操作" width="275" align="center">
                  <template v-slot="scope">
                    <div style="display: flex; gap: 2px; justify-content: center;">
                      <el-button type="info" plain @click="handlePreview(scope.row)"
                                 v-if="isPreviewable(scope.row)" size="small" title="预览">
                        <el-icon size="14"><Picture /></el-icon>
                      </el-button>
                      <el-button type="info" plain size="small" @click="enterDir(scope.row)"
                                 v-if="scope.row.isDir === 1" title="进入文件夹">
                        <el-icon size="14"><FolderOpened /></el-icon>
                      </el-button>
                      <el-button type="success" plain size="small" @click="download(scope.row)"
                                 v-if="scope.row.isDir === 0" title="下载">
                        <el-icon size="14"><Download /></el-icon>
                      </el-button>
                      <el-button type="warning" plain size="small" @click="handleRename(scope.row)" title="重命名" :disabled="userType === 0">
                        <el-icon size="14"><Edit /></el-icon>
                      </el-button>
                      <el-button type="primary" plain size="small" @click="handleMove(scope.row)" title="移动" :disabled="userType === 0">
                        <el-icon size="14"><CopyDocument /></el-icon>
                      </el-button>
                      <el-popconfirm title="确认删除吗?" @confirm="deleteFile(scope.row)">
                        <template #reference>
                          <el-button type="danger" plain size="small" title="删除" :disabled="userType === 0">
                            <el-icon size="14"><Delete /></el-icon>
                          </el-button>
                        </template>
                      </el-popconfirm>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 语录管理 -->
            <div v-show="op === 3">
              <el-table ref="sayingTableData" :data="filteredSayingTableData" style="width: 100%" height="calc(100vh - 250px)">
                <template #empty>
                  <el-empty description="暂无语录"></el-empty>
                </template>

                <el-table-column v-if="hasSayingFilter" type="index" label="序号" width="60" align="center">
                </el-table-column>

                <el-table-column v-if="!hasSayingFilter" type="index" label="序号" width="60" align="center"
                                 :index="(sayingPageInfo.current - 1) * sayingPageInfo.size + 1">
                </el-table-column>

                <el-table-column label="语录ID" width="90" align="center">
                  <template v-slot="scope">
                    {{ scope.row.id }}
                  </template>
                </el-table-column>

                <el-table-column label="用户ID" min-width="120" align="center">
                  <template v-slot="scope">
                    {{ scope.row.userId }}
                  </template>
                </el-table-column>

                <el-table-column label="昵称" min-width="120">
                  <template v-slot="scope">
                    {{ scope.row.userName }}
                  </template>
                </el-table-column>

                <el-table-column label="内容" min-width="750" prop="text" show-overflow-tooltip>
                  <!-- 不设置宽度，自动填充剩余空间 -->
                </el-table-column>

                <el-table-column label="时间" width="180" align="center">
                  <template v-slot="scope">
                    {{ scope.row.time.replace('T', ' ') }}
                  </template>
                </el-table-column>

                <el-table-column fixed="right" label="操作" width="110" align="center">
                  <template v-slot="scope">
                    <el-popconfirm title="确认删除吗?" @confirm="deleteSaying(scope.row)">
                      <template #reference>
                        <el-button type="danger" plain size="small" title="删除" :disabled="userType === 0">
                          <el-icon size="14"><Delete /></el-icon>
                        </el-button>
                      </template>
                    </el-popconfirm>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 用户管理 -->
            <div v-show="op === 5">
              <el-table ref="userTableData" :data="filteredUserTableData" style="width: 100%" height="calc(100vh - 250px)">
                <template #empty>
                  <el-empty description="暂无用户"></el-empty>
                </template>

                <el-table-column v-if="hasUserFilter" type="index" label="序号" width="60" align="center">
                </el-table-column>

                <el-table-column v-if="!hasUserFilter" type="index" label="序号" width="60" align="center"
                                 :index="(userPageInfo.current - 1) * userPageInfo.size + 1">
                </el-table-column>

                <el-table-column label="用户ID" min-width="120" align="center">
                  <template v-slot="scope">
                    {{ scope.row.id }}
                  </template>
                </el-table-column>

                <el-table-column label="昵称" min-width="200" show-overflow-tooltip>
                  <template v-slot="scope">
                    {{ scope.row.name }}
                  </template>
                </el-table-column>

                <el-table-column label="限权" width="100" align="center">
                  <template v-slot="scope">
                    {{ scope.row.access }}
                  </template>
                </el-table-column>

                <el-table-column label="等级" width="100" align="center">
                  <template v-slot="scope">
                    {{ scope.row.level }}
                  </template>
                </el-table-column>

                <el-table-column label="现金" width="100" align="center">
                  <template v-slot="scope">
                    {{ scope.row.cash }}
                  </template>
                </el-table-column>

                <el-table-column label="抽数" width="100" align="center">
                  <template v-slot="scope">
                    {{ scope.row.drawTimes }}
                  </template>
                </el-table-column>

                <el-table-column label="库容" width="100" align="center">
                  <template v-slot="scope">
                    {{ scope.row.capacity }}
                  </template>
                </el-table-column>

                <el-table-column fixed="right" label="操作" width="216" align="center">
                  <template v-slot="scope">
                    <div style="display: flex; gap: 2px; justify-content: center;">
                      <el-button type="success" plain size="small" @click="handleInventories(scope.row)" title="库存">
                        <el-icon size="14"><Box /></el-icon>
                      </el-button>
                      <el-button type="warning" plain @click="handleUserSetting(scope.row)" size="small" title="设置" :disabled="userType === 0">
                        <el-icon size="14"><Setting /></el-icon>
                      </el-button>
                      <el-popconfirm title="确认删除吗?" @confirm="deleteUser(scope.row)">
                        <template #reference>
                          <el-button type="danger" plain size="small" title="删除" :disabled="userType === 0">
                            <el-icon size="14"><Delete /></el-icon>
                          </el-button>
                        </template>
                      </el-popconfirm>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 群组管理 -->
            <div v-show="op === 6">
              <el-table ref="groupTableData" :data="filteredGroupTableData" style="width: 100%" height="calc(100vh - 250px)">
                <template #empty>
                  <el-empty description="暂无群组"></el-empty>
                </template>

                <el-table-column v-if="hasGroupFilter" type="index" label="序号" width="60" align="center">
                </el-table-column>

                <el-table-column v-if="!hasGroupFilter" type="index" label="序号" width="60" align="center"
                                 :index="(groupPageInfo.current - 1) * groupPageInfo.size + 1">
                </el-table-column>

                <el-table-column label="群组ID" min-width="120" align="center">
                  <template v-slot="scope">
                    {{ scope.row.id }}
                  </template>
                </el-table-column>

                <el-table-column label="群名" min-width="300" show-overflow-tooltip>
                  <template v-slot="scope">
                    {{ scope.row.name }}
                  </template>
                </el-table-column>

                <el-table-column label="限权" width="100" align="center">
                  <template v-slot="scope">
                    {{ scope.row.access }}
                  </template>
                </el-table-column>

                <el-table-column fixed="right" label="操作" width="216" align="center">
                  <template v-slot="scope">
                    <div style="display: flex; gap: 2px; justify-content: center;">
                      <el-button type="primary" plain @click="handleGroupFunc(scope.row)" size="small" title="功能" :disabled="userType === 0">
                        <el-icon size="14"><TurnOff /></el-icon>
                      </el-button>
                      <el-button type="warning" plain @click="handleGroupSetting(scope.row)" size="small" title="设置" :disabled="userType === 0">
                        <el-icon size="14"><Setting /></el-icon>
                      </el-button>
                      <el-popconfirm title="确认删除吗?" @confirm="deleteGroup(scope.row)">
                        <template #reference>
                          <el-button type="danger" plain size="small" title="删除" :disabled="userType === 0">
                            <el-icon size="14"><Delete /></el-icon>
                          </el-button>
                        </template>
                      </el-popconfirm>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 物品管理 -->
            <div v-show="op === 7">
              <el-table ref="itemTableData" :data="filteredItemTableData" style="width: 100%" height="calc(100vh - 250px)">
                <template #empty>
                  <el-empty description="暂无物品"></el-empty>
                </template>

                <el-table-column v-if="hasItemFilter" type="index" label="序号" width="60" align="center">
                </el-table-column>

                <el-table-column v-if="!hasItemFilter" type="index" label="序号" width="60" align="center"
                                 :index="(itemPageInfo.current - 1) * itemPageInfo.size + 1">
                </el-table-column>

                <el-table-column label="物品ID" width="90" align="center">
                  <template v-slot="scope">
                    {{ scope.row.id }}
                  </template>
                </el-table-column>

                <el-table-column label="名称" min-width="150">
                  <template v-slot="scope">
                    {{ scope.row.name }}
                  </template>
                </el-table-column>

                <el-table-column label="类别" width="100" align="center">
                  <template v-slot="scope">
                    {{ scope.row.category }}
                  </template>
                </el-table-column>

                <el-table-column label="品质" width="100" align="center">
                  <template v-slot="scope">
                    {{ scope.row.rarity }}
                  </template>
                </el-table-column>

                <el-table-column label="可获取" width="100" align="center">
                  <template v-slot="scope">
                    {{ scope.row.available ? 'YES' : 'NO' }}
                  </template>
                </el-table-column>

                <el-table-column prop="price" label="价格" width="100" align="center" :sortable="hasItemFilter">
                  <template v-slot="scope">
                    {{ scope.row.price }}
                  </template>
                </el-table-column>

                <el-table-column label="重量" width="100" align="center">
                  <template v-slot="scope">
                    {{ scope.row.weight }}
                  </template>
                </el-table-column>

                <el-table-column label="介绍" min-width="300" show-overflow-tooltip>
                  <template v-slot="scope">
                    {{ scope.row.description || 无介绍 }}
                  </template>
                </el-table-column>

                <el-table-column label="指令" min-width="150" show-overflow-tooltip>
                  <template v-slot="scope">
                    {{ scope.row.command || '无指令' }}
                  </template>
                </el-table-column>

                <el-table-column label="图路径" min-width="150" show-overflow-tooltip>
                  <template v-slot="scope">
                    {{ scope.row.imagePath || '无图片' }}
                  </template>
                </el-table-column>

                <el-table-column fixed="right" label="操作" width="150" align="center">
                  <template v-slot="scope">
                    <div style="display: flex; gap: 2px; justify-content: center;">
                      <el-button type="warning" plain @click="handleItemSetting(scope.row)" size="small" title="设置" :disabled="userType === 0">
                        <el-icon size="14"><Setting /></el-icon>
                      </el-button>
                      <el-popconfirm title="确认删除吗?" @confirm="deleteItem(scope.row)">
                        <template #reference>
                          <el-button type="danger" plain size="small" title="删除" :disabled="userType === 0">
                            <el-icon size="14"><Delete /></el-icon>
                          </el-button>
                        </template>
                      </el-popconfirm>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 数据统计 -->
            <div v-if="op === 4" style="margin-right: 40px; margin-top: 10px;">
              <el-header height="400px" style="padding: 0 0; display: flex; justify-content: left; align-items: center">
                  <div class="statistic-card" style="min-width: 110px">
                    <el-statistic :value="totalVisits">
                      <template #title>
                        <div style="display: inline-flex; align-items: center">
                          总调用次数
                          <el-tooltip
                              effect="dark"
                              content="自 2025/12/23 起的指令使用总次数 (数据统计启用于该日)"
                              placement="top"
                          >
                            <el-icon style="margin-left: 4px" :size="12">
                              <Warning />
                            </el-icon>
                          </el-tooltip>
                        </div>
                      </template>
                    </el-statistic>
<!--                    <div class="statistic-footer">-->
<!--                      <div class="footer-item">-->
<!--                        <span>than yesterday</span>-->
<!--                        <span class="green">24%<el-icon><CaretTop /></el-icon></span>-->
<!--                      </div>-->
<!--                    </div>-->
                  </div>
                <LineChart
                    :title="'每日访问量 (近30日)'"
                    :y_name="'调用次数'"
                    :data="visitsData"
                    :xAxis="visitsXAxis"
                    :height="'400px'"
                    :width="'90%'"
                />
              </el-header>
              <el-scrollbar height="calc(100vh - 600px)">
                <BarChart
                    :title="'指令访问量 (Top20)'"
                    :y_name="'调用次数'"
                    :data="topCommandsData"
                    :xAxis="topCommandsAxis"
                    :height="'235px'"
                    :width="'100%'"
                />
                <BarChart
                    :title="'用户访问量 (Top20)'"
                    :y_name="'调用次数'"
                    :data="topUsersData"
                    :xAxis="topUsersAxis"
                    :height="'235px'"
                    :width="'100%'"
                />
                <BarChart
                    :title="'群聊访问量 (Top20)'"
                    :y_name="'调用次数'"
                    :data="topGroupsData"
                    :xAxis="topGroupsAxis"
                    :height="'235px'"
                    :width="'100%'"
                />
              </el-scrollbar>
            </div>

            <!-- 个人中心 -->
            <div v-show="op === 2" style="margin-right: 20px;">
              <el-descriptions title="用户信息" size="small" label-width="80px" style="margin-bottom: 20px" :column="1" border>
                <el-descriptions-item label="ID">
                  <el-tag type="danger">{{ info.id || '无' }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="名称">
                  <el-tag type="success">{{ info.username || '无' }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="邮箱">
                  <el-tag>{{ info.email || '无' }}</el-tag>
                </el-descriptions-item>
              </el-descriptions>

              <el-descriptions title="访问信息" size="small" label-width="80px" style="margin-bottom: 20px" :column="1" border>
                <el-descriptions-item label="Type">
                  <el-tag type="warning">{{ userType }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="Token">
                  <el-tag type="warning" style="white-space: normal; word-break: break-all; height: auto; padding-bottom: 5px; padding-top: 5px">{{ token }}</el-tag>
                </el-descriptions-item>
              </el-descriptions>

              <div style="position: fixed; bottom: 75px; right: 50px; display: flex; flex-wrap: nowrap; gap: 10px;">
                <el-button type="success" round plain @click="handleAdminEdit" :disabled="userType === 0">
                  <el-icon size="15"><Edit /></el-icon>&nbsp;修改信息
                </el-button>
                <el-button type="warning" round plain @click="handlePasswordChange" :disabled="userType === 0">
                  <el-icon size="15"><Setting /></el-icon>&nbsp;修改密码
                </el-button>
                <el-popconfirm title="确认注销吗?" @confirm="deleteAdmin">
                  <template #reference>
                    <el-button type="primary" round plain :disabled="userType === 0">
                      <el-icon size="15"><Delete /></el-icon>&nbsp;注销账号
                    </el-button>
                  </template>
                </el-popconfirm>
                <el-button type="danger" round plain @click="logout">
                  <el-icon size="15"><SwitchButton /></el-icon>&nbsp;退出登录
                </el-button>
              </div>
            </div>

            <!-- 系统调用 -->
            <div v-show="op === 8" style="margin-right: 20px;">
              <el-form>
                <el-form-item label="调用指令" prop="invokeCommand">
                  <div style="display: flex; width: 100%">
                    <el-input placeholder="请输入指令... 格式: [Bean名] [方法名] [参数...]" v-model="invokeCommand" style="flex: 1; min-width: 0;"/>
                    <el-button type="danger" plain @click="this.invokeResult = ''" style="white-space: nowrap; margin-left: 0">
                      <el-icon size="15"><Delete /></el-icon>&nbsp;清空
                    </el-button>
                    <el-button type="primary" plain @click="invoke" style="white-space: nowrap; margin-left: 0">
                      <el-icon size="15"><Grid /></el-icon>&nbsp;调用
                    </el-button>
                  </div>
                </el-form-item>

                <el-form-item label="执行结果" prop="invokeResult">
                  <el-input placeholder="无指令输出..." v-model="invokeResult" type="textarea" :autosize="{ minRows: 50, maxRows: 50 }" style="width: 100%"/>
                </el-form-item>
              </el-form>
            </div>

          </el-main>

          <!-- 下部分页区域 -->
          <el-footer height="60px" style="padding: 10px 20px;">
            <div v-show="op === 1" style="display: flex; align-items: center; justify-content: space-between;">
              <el-text style="flex: 1; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 30px;">
                <el-icon><InfoFilled /></el-icon> 共 {{ filePageInfo.total }} 条记录
              </el-text>
              <el-pagination
                  background
                  @size-change="handleFileSizeChange"
                  @current-change="handleFileCurrentChange"
                  layout="sizes, prev, pager, next"
                  :page-sizes="[10, 20, 30, 40]"
                  :page-size="filePageInfo.size"
                  :total="filePageInfo.total"
                  :current-page="filePageInfo.current"
                  :pager-count="7">
              </el-pagination>
            </div>

            <div v-show="op === 3" style="display: flex; align-items: center; justify-content: space-between;">
              <el-text v-if="hasSayingFilter" style="flex: 1; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 30px;">
                <el-icon><InfoFilled /></el-icon> 共 {{ filteredSayingTableData.length }} 条记录
              </el-text>
              <el-text v-if="!hasSayingFilter" style="flex: 1; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 30px;">
                <el-icon><InfoFilled /></el-icon> 共 {{ sayingPageInfo.total }} 条记录
              </el-text>
              <el-pagination
                  v-if="!hasSayingFilter"
                  background
                  @size-change="handleSayingSizeChange"
                  @current-change="handleSayingCurrentChange"
                  layout="sizes, prev, pager, next"
                  :page-sizes="[10, 20, 30, 40]"
                  :page-size="sayingPageInfo.size"
                  :total="sayingPageInfo.total"
                  :current-page="sayingPageInfo.current"
                  :pager-count="7">
              </el-pagination>
            </div>

            <div v-show="op === 5" style="display: flex; align-items: center; justify-content: space-between;">
              <el-text v-if="hasUserFilter" style="flex: 1; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 30px;">
                <el-icon><InfoFilled /></el-icon> 共 {{ filteredUserTableData.length }} 条记录
              </el-text>
              <el-text v-if="!hasUserFilter" style="flex: 1; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 30px;">
                <el-icon><InfoFilled /></el-icon> 共 {{ userPageInfo.total }} 条记录
              </el-text>
              <el-pagination
                  v-if="!hasUserFilter"
                  background
                  @size-change="handleUserSizeChange"
                  @current-change="handleUserCurrentChange"
                  layout="sizes, prev, pager, next"
                  :page-sizes="[10, 20, 30, 40]"
                  :page-size="userPageInfo.size"
                  :total="userPageInfo.total"
                  :current-page="userPageInfo.current"
                  :pager-count="7">
              </el-pagination>
            </div>

            <div v-show="op === 6" style="display: flex; align-items: center; justify-content: space-between;">
              <el-text v-if="hasGroupFilter" style="flex: 1; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 30px;">
                <el-icon><InfoFilled /></el-icon> 共 {{ filteredGroupTableData.length }} 条记录
              </el-text>
              <el-text v-if="!hasGroupFilter" style="flex: 1; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 30px;">
                <el-icon><InfoFilled /></el-icon> 共 {{ groupPageInfo.total }} 条记录
              </el-text>
              <el-pagination
                  v-if="!hasGroupFilter"
                  background
                  @size-change="handleGroupSizeChange"
                  @current-change="handleGroupCurrentChange"
                  layout="sizes, prev, pager, next"
                  :page-sizes="[10, 20, 30, 40]"
                  :page-size="groupPageInfo.size"
                  :total="groupPageInfo.total"
                  :current-page="groupPageInfo.current"
                  :pager-count="7">
              </el-pagination>
            </div>

            <div v-show="op === 7" style="display: flex; align-items: center; justify-content: space-between;">
              <el-text v-if="hasItemFilter" style="flex: 1; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 30px;">
                <el-icon><InfoFilled /></el-icon> 共 {{ filteredItemTableData.length }} 条记录
              </el-text>
              <el-text v-if="!hasItemFilter" style="flex: 1; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 30px;">
                <el-icon><InfoFilled /></el-icon> 共 {{ itemPageInfo.total }} 条记录
              </el-text>
              <el-pagination
                  v-if="!hasItemFilter"
                  background
                  @size-change="handleItemSizeChange"
                  @current-change="handleItemCurrentChange"
                  layout="sizes, prev, pager, next"
                  :page-sizes="[10, 20, 30, 40]"
                  :page-size="itemPageInfo.size"
                  :total="itemPageInfo.total"
                  :current-page="itemPageInfo.current"
                  :pager-count="7">
              </el-pagination>
            </div>
          </el-footer>
        </el-container>
      </el-container>

      <!-- 搜索对话框 -->
      <el-dialog title="搜索结果" v-model="searchTableVisible" width="75%">
        <el-table ref="searchData" :data="searchData" style="width: 100%" stripe>
          <template #empty>
            <el-empty description="无搜索结果"></el-empty>
          </template>

          <el-table-column type="index" label="序号" width="60" align="center">
          </el-table-column>

          <el-table-column label="文件名" min-width="200">
            <template v-slot="scope">
              <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                {{ scope.row.fileName }}
              </div>
            </template>
          </el-table-column>

          <el-table-column label="所有者" width="100" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{ scope.row.ownerId != null ? (scope.row.ownerName ? `${scope.row.ownerName}(${scope.row.ownerId})` : `(${scope.row.ownerId})`) : '-' }}
            </template>
          </el-table-column>

          <el-table-column label="修改日期" width="160" align="center">
            <template v-slot="scope">
              {{ scope.row.lastModified === null ? '-' : scope.row.lastModified.replace('T', ' ') }}
            </template>
          </el-table-column>

          <el-table-column label="文件大小" width="120" align="center">
            <template v-slot="scope">
              {{ scope.row.isDir === 1 ? '-' : formatFileSize(scope.row.fileSize) }}
            </template>
          </el-table-column>

          <el-table-column label="文件类型" width="100" align="center">
            <template v-slot="scope">
              <el-tag :type="scope.row.isDir === 1 ? 'info' : 'success'" style="min-width: 70px" effect="plain" round>
                {{ scope.row.isDir === 1 ? '文件夹' : getFileExtension(scope.row.fileName) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column v-if="userType === 1" label="可见性" width="100" align="center">
            <template v-slot="scope">
              <el-switch v-model="scope.row.visible" inline-prompt :active-icon="Check" :inactive-icon="Close" style="--el-switch-on-color: rgba(102,192,58,0.81)"
                         :loading="scope.row._loading" :before-change="() => changeFileVisible(scope.row)"/>
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="216" align="center">
            <template v-slot="scope">
              <div style="display: flex; gap: 2px; justify-content: center;">
                <el-button type="info" plain @click="handlePreview(scope.row)"
                           v-if="isPreviewable(scope.row)" size="small" title="预览">
                  <el-icon size="14"><Picture /></el-icon>
                </el-button>
                <el-button type="primary" plain size="small" @click="enterDir(scope.row)"
                           v-if="scope.row.isDir === 1" title="进入文件夹">
                  <el-icon size="14"><FolderOpened /></el-icon>
                </el-button>
                <el-button type="success" plain size="small" @click="download(scope.row)"
                           v-if="scope.row.isDir === 0" title="下载">
                  <el-icon size="14"><Download /></el-icon>
                </el-button>
                <el-button type="warning" plain size="small" @click="handleRename(scope.row)" title="重命名" :disabled="userType === 0">
                  <el-icon size="14"><Edit /></el-icon>
                </el-button>
                <el-popconfirm title="确认删除吗?" @confirm="deleteFile(scope.row)">
                  <template #reference>
                    <el-button type="danger" plain size="small" title="删除" :disabled="userType === 0">
                      <el-icon size="14"><Delete /></el-icon>
                    </el-button>
                  </template>
                </el-popconfirm>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <!-- 图片/视频预览对话框 -->
      <el-dialog v-model="previewVisible" :title="previewTitle" :destroy-on-close="true" width="70%" top="5vh" center>
        <div style="text-align: center; max-height: 70vh; overflow: auto;">
          <!-- 图片预览 -->
          <el-image
              v-if="previewType === 'image'"
              :src="previewUrl"
              :preview-src-list="[previewUrl]"
              fit="contain"
              style="max-width: 100%; max-height: 65vh;"
              :hide-on-click-modal="true"
          />
          <!-- 视频预览 -->
          <video
              v-else-if="previewType === 'video'"
              :src="previewUrl"
              controls
              autoplay
              style="max-width: 100%; max-height: 65vh;"
          >
            您的浏览器不支持 video 标签。
          </video>
          <!-- 音频预览 -->
          <audio
              v-else-if="previewType === 'audio'"
              ref="videoPlayer"
              :src="previewUrl"
              controls
              autoplay
              style="max-width: 100%; max-height: 65vh;"
          >
            您的浏览器不支持 audio 标签。
          </audio>
          <!-- 可以在这里扩展 -->
        </div>
      </el-dialog>

      <!-- 用户编辑对话框 -->
      <el-dialog v-model="userSettingVisible" title="用户设置" width="500px">
        <el-form ref="userSettingFormRef" :model="userForm" label-width="100px">
          <el-form-item label="用户ID" prop="id">
            <el-input v-model="userForm.id" :disabled="true" style="width: 90%"/>
          </el-form-item>

          <el-form-item label="昵称" prop="name">
            <el-input v-model="userForm.name" :disabled="true" style="width: 90%"/>
          </el-form-item>

          <el-form-item label="权限" prop="access">
            <el-select v-model="userForm.access" style="width: 90%">
              <el-option label="II级 (超级管理)" :value="2" />
              <el-option label="I级 (管理)" :value="1" />
              <el-option label="0级 (用户)" :value="0" />
              <el-option label="-I级 (限制)" :value="-1" />
              <el-option label="-II级 (禁用)" :value="-2" />
            </el-select>
          </el-form-item>

          <el-form-item label="等级" prop="level">
            <el-input v-model="userForm.level" oninput="value=value.replace(/\D/g,'')" style="width: 90%"/>
          </el-form-item>

          <el-form-item label="现金" prop="cash">
            <el-input v-model="userForm.cash" oninput="value=value.replace(/\D/g,'')" style="width: 90%"/>
          </el-form-item>

          <el-form-item label="抽数" prop="drawTimes">
            <el-input v-model="userForm.drawTimes" oninput="value=value.replace(/\D/g,'')" style="width: 90%"/>
          </el-form-item>

          <el-form-item label="仓库容量" prop="capacity">
            <el-input v-model="userForm.capacity" oninput="value=value.replace(/\D/g,'')" style="width: 90%"/>
          </el-form-item>
        </el-form>

        <template #footer>
          <div class="user-setting-dialog-footer">
            <el-button plain @click="userSettingVisible = false">取消</el-button>
            <el-button plain type="primary" @click="handleUserSettingSubmit">保存</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 群组编辑对话框 -->
      <el-dialog v-model="groupSettingVisible" title="群组设置" width="500px">
        <el-form ref="groupSettingFormRef" :model="groupForm" label-width="100px">
            <el-form-item label="群组ID" prop="id">
              <el-input v-model="groupForm.id" :disabled="true" style="width: 90%"/>
            </el-form-item>

            <el-form-item label="群名" prop="name">
              <el-input v-model="groupForm.name" :disabled="true" style="width: 90%"/>
            </el-form-item>

            <el-form-item label="权限" prop="access">
              <el-select v-model="groupForm.access" style="width: 90%">
                <el-option label="II级 (超级管理)" :value="2" />
                <el-option label="I级 (管理)" :value="1" />
                <el-option label="0级 (用户)" :value="0" />
                <el-option label="-I级 (限制)" :value="-1" />
                <el-option label="-II级 (禁用)" :value="-2" />
              </el-select>
            </el-form-item>
        </el-form>

        <template #footer>
          <div class="group-setting-dialog-footer">
            <el-button plain @click="groupSettingVisible = false">取消</el-button>
            <el-button plain type="primary" @click="handleGroupSettingSubmit">保存</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 功能设置对话框 -->
      <el-dialog v-model="groupFuncVisible" :title="`功能设置 - 群聊 ${groupFuncForm.groupId}`" width="450px">
        <div class="function-sections">
          <!-- AIChat 功能模块 -->
          <div class="function-section">
            <div class="section-header">
              <el-icon><Promotion /></el-icon>
              <span class="section-title">AIChat 设置</span>
            </div>

            <el-form ref="groupFuncAiFormRef" :inline="true" :model="groupFuncForm" label-width="100px">
              <el-form-item label="会话范围" prop="scope">
                <el-select v-model="groupFuncForm.scope" style="width: 250px">
                  <el-option label="Group" :value="'Group'" />
                  <el-option label="Personal" :value="'Personal'" />
                  <el-option label="Monitor" :value="'Monitor'" />
                </el-select>
              </el-form-item>

              <el-form-item label="发言频率" prop="replyFrequency" :required="true">
                <el-input v-model="groupFuncForm.replyFrequency" placeholder="请输入频率(0~1)..." style="width: 250px"/>
              </el-form-item>

              <el-form-item label="思考模式" prop="thinking" style="margin-left: 15px">
                <el-switch
                    v-model="groupFuncForm.thinking"
                    inline-prompt
                    style="--el-switch-on-color: rgba(19,206,102,0.75)"
                    :active-icon="Check"
                    :inactive-icon="Close"
                />
              </el-form-item>

              <el-form-item label="语音模式" prop="voice">
                <el-switch
                    v-model="groupFuncForm.voice"
                    inline-prompt
                    style="--el-switch-on-color: rgba(19,206,102,0.75)"
                    :active-icon="Check"
                    :inactive-icon="Close"
                />
              </el-form-item>

              <el-form-item label="指令模式" prop="embedding" style="margin-left: 15px">
                <el-switch
                    v-model="groupFuncForm.embedding"
                    inline-prompt
                    style="--el-switch-on-color: rgba(19,206,102,0.75)"
                    :active-icon="Check"
                    :inactive-icon="Close"
                />
              </el-form-item>

              <el-form-item label="防注模式" prop="antiInjection">
                <el-switch
                    v-model="groupFuncForm.antiInjection"
                    inline-prompt
                    style="--el-switch-on-color: rgba(19,206,102,0.75)"
                    :active-icon="Check"
                    :inactive-icon="Close"
                />
              </el-form-item>

              <el-form-item label="自定模式" prop="custom" style="margin-left: 15px">
                <el-switch
                    v-model="groupFuncForm.custom"
                    inline-prompt
                    style="--el-switch-on-color: rgba(19,206,102,0.75)"
                    :active-icon="Check"
                    :inactive-icon="Close"
                />
              </el-form-item>

              <el-form-item label="指令校验" prop="embeddingAuth">
                <el-switch
                    v-model="groupFuncForm.embeddingAuth"
                    inline-prompt
                    style="--el-switch-on-color: rgba(19,206,102,0.75)"
                    :active-icon="Check"
                    :inactive-icon="Close"
                />
              </el-form-item>

              <el-form-item label="自动发言" prop="autoReply" style="margin-left: 15px">
                <el-switch
                    v-model="groupFuncForm.autoReply"
                    inline-prompt
                    style="--el-switch-on-color: rgba(19,206,102,0.75)"
                    :active-icon="Check"
                    :inactive-icon="Close"
                />
              </el-form-item>
            </el-form>
          </div>

          <!-- Monitor 功能模块 -->
          <div class="function-section">
            <div class="section-header">
              <el-icon><Monitor /></el-icon>
              <span class="section-title">Monitor 设置</span>
            </div>

            <el-form ref="groupFuncMonitorFormRef" :inline="true" :model="groupFuncForm" label-width="100px">
              <el-form-item label="图片收集" prop="imageCollect" style="margin-left: 15px">
                <el-switch
                    v-model="groupFuncForm.imageCollect"
                    inline-prompt
                    style="--el-switch-on-color: rgba(19,206,102,0.75)"
                    :active-icon="Check"
                    :inactive-icon="Close"
                />
              </el-form-item>

              <el-form-item label="消息收集" prop="messageCollect">
                <el-switch
                    v-model="groupFuncForm.messageCollect"
                    inline-prompt
                    style="--el-switch-on-color: rgba(19,206,102,0.75)"
                    :active-icon="Check"
                    :inactive-icon="Close"
                />
              </el-form-item>

              <el-form-item label="词语检测" prop="keywordDetect" style="margin-left: 15px">
                <el-switch
                    v-model="groupFuncForm.keywordDetect"
                    inline-prompt
                    style="--el-switch-on-color: rgba(19,206,102,0.75)"
                    :active-icon="Check"
                    :inactive-icon="Close"
                />
              </el-form-item>

              <el-form-item label="戳戳检测" prop="pokeDetect">
                <el-switch
                    v-model="groupFuncForm.pokeDetect"
                    inline-prompt
                    style="--el-switch-on-color: rgba(19,206,102,0.75)"
                    :active-icon="Check"
                    :inactive-icon="Close"
                />
              </el-form-item>

              <el-form-item label="撤回检测" prop="recallDetect" style="margin-left: 15px">
                <el-switch
                    v-model="groupFuncForm.recallDetect"
                    inline-prompt
                    style="--el-switch-on-color: rgba(19,206,102,0.75)"
                    :active-icon="Check"
                    :inactive-icon="Close"
                />
              </el-form-item>
            </el-form>
          </div>

          <!-- Guess 功能模块 -->
          <div class="function-section">
            <div class="section-header">
              <el-icon><Grid /></el-icon>
              <span class="section-title">Guess 设置</span>
            </div>

            <el-form ref="groupFuncGuessFormRef" :inline="true" :model="groupFuncForm" label-width="100px">
              <el-form-item label="切割比例" prop="guessRatio" :required="true">
                <el-input v-model="groupFuncForm.guessRatio" placeholder="请输入比例..." style="width: 250px"/>
              </el-form-item>

              <el-form-item label="切割边距" prop="guessPadding" :required="true">
                <el-input v-model="groupFuncForm.guessPadding" placeholder="请输入边距..." style="width: 250px"/>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <template #footer>
          <div class="group-func-dialog-footer">
            <el-button plain @click="groupFuncVisible = false">取消</el-button>
            <el-button plain type="primary" @click="handleGroupFuncSubmit">保存</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 物品编辑对话框 -->
      <el-dialog v-model="itemSettingVisible" title="物品设置" width="500px">
        <el-form ref="itemSettingFormRef" :model="itemForm" label-width="100px">
          <el-form-item label="物品ID" prop="id">
            <el-input v-model="itemForm.id" :disabled="true" style="width: 90%"/>
          </el-form-item>

          <el-form-item label="名称" prop="name" :required="true">
            <el-input v-model="itemForm.name" placeholder="请输入名称..." style="width: 90%"/>
          </el-form-item>

          <el-form-item label="类别" prop="category" :required="true">
            <el-select v-model="itemForm.category" placeholder="请选择类别..." style="width: 90%">
              <el-option label="COMMON" :value="0" />
              <el-option label="SPECIAL" :value="1" />
              <el-option label="BREAD" :value="2" />
              <el-option label="LOOTING" :value="3" />
            </el-select>
          </el-form-item>

          <el-form-item label="品质" prop="rarity" :required="true">
            <el-select v-model="itemForm.rarity" placeholder="请选择品质..." style="width: 90%">
              <el-option label="WHITE" :value="0" />
              <el-option label="GREEN" :value="1" />
              <el-option label="BLUE" :value="2" />
              <el-option label="PURPLE" :value="3" />
              <el-option label="GOLD" :value="4" />
              <el-option label="RED" :value="5" />
            </el-select>
          </el-form-item>

          <el-form-item label="可获得" prop="available" :required="true">
            <el-switch
                v-model="itemForm.available"
                inline-prompt
                style="--el-switch-on-color: rgba(19,206,102,0.75); --el-switch-off-color: rgba(255,73,73,0.75)"
                :active-icon="Check"
                :inactive-icon="Close"
            />
          </el-form-item>

          <el-form-item label="价格" prop="price" :required="true">
            <el-input v-model="itemForm.price" oninput="value=value.replace(/\D/g,'')" placeholder="请输入价格..." style="width: 90%"/>
          </el-form-item>

          <el-form-item label="重量" prop="weight" :required="true">
            <el-input v-model="itemForm.weight" oninput="value=value.replace(/\D/g,'')" placeholder="请输入重量..." style="width: 90%"/>
          </el-form-item>

          <el-form-item label="介绍" prop="description">
            <el-input v-model="itemForm.description" placeholder="暂无介绍" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" style="width: 90%"/>
          </el-form-item>

          <el-form-item label="指令" prop="command">
            <el-input v-model="itemForm.command" placeholder="暂无指令" style="width: 90%"/>
          </el-form-item>

          <el-form-item label="图路径" prop="imagePath">
            <el-input v-model="itemForm.imagePath" placeholder="暂无路径" style="width: 90%"/>
          </el-form-item>
        </el-form>

        <template #footer>
          <div class="item-setting-dialog-footer">
            <el-button plain @click="itemSettingVisible = false">取消</el-button>
            <el-button plain type="primary" @click="handleItemSettingSubmit">保存</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 物品新增对话框 -->
      <el-dialog v-model="itemAddingVisible" title="新增物品" width="500px">
        <el-form ref="itemAddingFormRef" :model="itemForm" label-width="100px">
          <el-form-item label="名称" prop="name" :required="true">
            <el-input v-model="itemForm.name" placeholder="请输入名称..." style="width: 90%"/>
          </el-form-item>

          <el-form-item label="类别" prop="category" :required="true">
            <el-select v-model="itemForm.category" placeholder="请选择类别..." style="width: 90%">
              <el-option label="COMMON" :value="0" />
              <el-option label="SPECIAL" :value="1" />
              <el-option label="BREAD" :value="2" />
              <el-option label="LOOTING" :value="3" />
            </el-select>
          </el-form-item>

          <el-form-item label="品质" prop="rarity" :required="true">
            <el-select v-model="itemForm.rarity" placeholder="请选择品质..." style="width: 90%">
              <el-option label="WHITE" :value="0" />
              <el-option label="GREEN" :value="1" />
              <el-option label="BLUE" :value="2" />
              <el-option label="PURPLE" :value="3" />
              <el-option label="GOLD" :value="4" />
              <el-option label="RED" :value="5" />
            </el-select>
          </el-form-item>

          <el-form-item label="可获得" prop="available" :required="true">
            <el-switch
                v-model="itemForm.available"
                inline-prompt
                style="--el-switch-on-color: rgba(19,206,102,0.75); --el-switch-off-color: rgba(255,73,73,0.75)"
                :active-icon="Check"
                :inactive-icon="Close"
            />
          </el-form-item>

          <el-form-item label="价格" prop="price" :required="true">
            <el-input v-model="itemForm.price" oninput="value=value.replace(/\D/g,'')" placeholder="请输入价格..." style="width: 90%"/>
          </el-form-item>

          <el-form-item label="重量" prop="weight" :required="true">
            <el-input v-model="itemForm.weight" oninput="value=value.replace(/\D/g,'')" placeholder="请输入重量..." style="width: 90%"/>
          </el-form-item>

          <el-form-item label="介绍" prop="description">
            <el-input v-model="itemForm.description" placeholder="暂无介绍" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" style="width: 90%"/>
          </el-form-item>

          <el-form-item label="指令" prop="command">
            <el-input v-model="itemForm.command" placeholder="暂无指令" style="width: 90%"/>
          </el-form-item>

          <el-form-item label="图路径" prop="imagePath">
            <el-input v-model="itemForm.imagePath" placeholder="暂无路径" style="width: 90%"/>
          </el-form-item>
        </el-form>

        <template #footer>
          <div class="item-adding-dialog-footer">
            <el-button plain @click="itemAddingVisible = false">取消</el-button>
            <el-button plain type="primary" @click="handleItemAddingSubmit">保存</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 语录导入对话框 -->
      <el-dialog v-model="sayingImportVisible" title="导入 - 语录 CSV 文件" width="500px">
        <el-upload
            class="upload-import-saying"
            drag
            :before-upload="isCsv"
            :headers="uploadHeaders"
            :action="uploadAction('/saying/importCsv')"
            :on-success="refreshSaying"
            :on-error="(error, file, fileList) => {
              refreshSaying()
              this.$message.warning(`CSV 文件存在数据结构或约束问题 - 可用数据已导入`)
            }"
            multiple
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            Drop csv file here or <em>click to import</em>
          </div>
        </el-upload>
      </el-dialog>

      <!-- 用户导入对话框 -->
      <el-dialog v-model="userImportVisible" title="导入 - 用户 CSV 文件" width="500px">
        <el-upload
            class="upload-import-user"
            drag
            :before-upload="isCsv"
            :headers="uploadHeaders"
            :action="uploadAction('/user/importCsv')"
            :on-success="refreshUser"
            :on-error="(error, file, fileList) => {
              refreshUser()
              this.$message.warning(`CSV 文件存在数据结构或约束问题 - 可用数据已导入`)
            }"
            multiple
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            Drop csv file here or <em>click to import</em>
          </div>
        </el-upload>
      </el-dialog>

      <!-- 群组导入对话框 -->
      <el-dialog v-model="groupImportVisible" title="导入 - 群组 CSV 文件" width="500px">
        <el-upload
            class="upload-import-group"
            drag
            :before-upload="isCsv"
            :headers="uploadHeaders"
            :action="uploadAction('/group/importCsv')"
            :on-success="refreshGroup"
            :on-error="(error, file, fileList) => {
              refreshGroup()
              this.$message.warning(`CSV 文件存在数据结构或约束问题 - 可用数据已导入`)
            }"
            multiple
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            Drop csv file here or <em>click to import</em>
          </div>
        </el-upload>
      </el-dialog>

      <!-- 功能导入对话框 -->
      <el-dialog v-model="funcImportVisible" title="导入 - 配置 CSV 文件" width="500px">
        <el-upload
            class="upload-import-func"
            drag
            :before-upload="isCsv"
            :headers="uploadHeaders"
            :action="uploadAction('/setting/importCsv')"
            :on-success="refreshSaying"
            :on-error="(error, file, fileList) => {
              this.$message.warning(`CSV 文件存在数据结构或约束问题 - 可用数据已导入`)
            }"
            multiple
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            Drop csv file here or <em>click to import</em>
          </div>
        </el-upload>
      </el-dialog>

      <!-- 物品导入对话框 -->
      <el-dialog v-model="itemImportVisible" title="导入 - 物品 CSV 文件" width="500px">
        <el-upload
            class="upload-import-item"
            drag
            :before-upload="isCsv"
            :headers="uploadHeaders"
            :action="uploadAction('/item/importCsv')"
            :on-success="refreshItem"
            :on-error="(error, file, fileList) => {
              refreshItem()
              this.$message.warning(`CSV 文件存在数据结构或约束问题 - 可用数据已导入`)
            }"
            multiple
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            Drop csv file here or <em>click to import</em>
          </div>
        </el-upload>
      </el-dialog>

      <!-- 库存导入对话框 -->
      <el-dialog v-model="inventoryImportVisible" title="导入 - 库存 CSV 文件" width="500px">
        <el-upload
            class="upload-import-inventory"
            drag
            :before-upload="isCsv"
            :headers="uploadHeaders"
            :action="uploadAction('/inventory/importCsv')"
            :on-error="(error, file, fileList) => {
              this.$message.warning(`CSV 文件存在数据结构或约束问题 - 可用数据已导入`)
            }"
            multiple
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            Drop csv file here or <em>click to import</em>
          </div>
        </el-upload>
      </el-dialog>

      <!-- 用户库存对话框 -->
      <el-dialog v-model="inventoriesVisible" :title="inventoriesTitle" width="55%">
        <el-table ref="inventoriesData" :data="inventoriesData" style="width: 100%" stripe>
          <template #empty>
            <el-empty description="暂无库存"></el-empty>
          </template>

          <el-table-column type="index" label="序号" width="60" align="center">
          </el-table-column>

          <el-table-column label="库存ID" width="90" align="center">
            <template v-slot="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>

          <el-table-column label="物品ID" width="90" align="center">
            <template v-slot="scope">
              {{ scope.row.itemId }}
            </template>
          </el-table-column>

          <el-table-column label="名称" min-width="150">
            <template v-slot="scope">
              {{ scope.row.itemName }}
            </template>
          </el-table-column>

          <el-table-column label="类别" width="100" align="center">
            <template v-slot="scope">
              {{ scope.row.category }}
            </template>
          </el-table-column>

          <el-table-column label="品质" width="100" align="center">
            <template v-slot="scope">
              {{ scope.row.rarity }}
            </template>
          </el-table-column>

          <el-table-column prop="price" label="价格" width="100" align="center" sortable>
            <template v-slot="scope">
              {{ scope.row.price }}
            </template>
          </el-table-column>

          <el-table-column label="数量" width="100" align="center">
            <template v-slot="scope">
              {{ scope.row.amount }}
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template v-slot="scope">
              <div style="display: flex; gap: 2px; justify-content: center;">
                <el-button type="warning" plain @click="handleInventorySetting(scope.row)" size="small" title="设置" :disabled="userType === 0">
                  <el-icon size="14"><Setting /></el-icon>
                </el-button>
                <el-popconfirm title="确认删除吗?" @confirm="deleteInventory(scope.row)">
                  <template #reference>
                    <el-button type="danger" plain size="small" title="删除" :disabled="userType === 0">
                      <el-icon size="14"><Delete /></el-icon>
                    </el-button>
                  </template>
                </el-popconfirm>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <template #footer>
          <div class="inventories-dialog-footer">
            <el-form-item prop="newItemId" style="margin-bottom: 0; margin-right: 16px;">
              <el-input :prefix-icon="Box" v-model="newItemId" oninput="value=value.replace(/\D/g,'')"
                        placeholder="请输入新增库存物品ID..." style="width: 100%"/>
            </el-form-item>
            <el-button plain type="primary" @click="addInventory(inventoriesUserId, newItemId)" style="width: 200px" :disabled="userType === 0">
              <el-icon size="15px"><Plus /></el-icon>&nbsp;新增库存
            </el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 用户库存编辑对话框 -->
      <el-dialog v-model="inventorySettingVisible" title="库存设置" width="500px">
        <el-form ref="inventorySettingFormRef" :model="inventoryForm" label-width="100px">
          <el-form-item label="库存ID" prop="id">
            <el-input v-model="inventoryForm.id" :disabled="true" style="width: 90%"/>
          </el-form-item>

          <el-form-item label="物品ID" prop="itemId">
            <el-input v-model="inventoryForm.itemId" :disabled="true" style="width: 90%"/>
          </el-form-item>

          <el-form-item label="名称" prop="itemName">
            <el-input v-model="inventoryForm.itemName" :disabled="true" style="width: 90%"/>
          </el-form-item>

          <el-form-item label="类别" prop="category">
            <el-select v-model="inventoryForm.category" :disabled="true" style="width: 90%">
            </el-select>
          </el-form-item>

          <el-form-item label="品质" prop="rarity">
            <el-select v-model="inventoryForm.rarity" :disabled="true" style="width: 90%">
            </el-select>
          </el-form-item>

          <el-form-item label="价格" prop="price">
            <el-input v-model="inventoryForm.price" :disabled="true" style="width: 90%"/>
          </el-form-item>

          <el-form-item label="数量" prop="amount" :required="true">
            <el-input v-model="inventoryForm.amount" oninput="value=value.replace(/\D/g,'')" placeholder="请输入数量..." style="width: 90%"/>
          </el-form-item>
        </el-form>

        <template #footer>
          <div class="inventory-setting-dialog-footer">
            <el-button plain @click="inventorySettingVisible = false">取消</el-button>
            <el-button plain type="primary" @click="handleInventorySettingSubmit">保存</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 个人信息编辑对话框 -->
      <el-dialog v-model="adminEditVisible" title="个人信息修改" width="500px">
        <el-form ref="adminEditFormRef" :model="adminEditForm" label-width="100px">
          <el-form-item label="ID" prop="id">
            <el-input v-model="adminEditForm.id" :disabled="true" style="width: 90%"/>
          </el-form-item>

          <el-form-item label="名称" prop="username">
            <el-input v-model="adminEditForm.username" style="width: 90%"/>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="adminEditForm.email" style="width: 90%">
            </el-input>
          </el-form-item>
        </el-form>

        <template #footer>
          <div class="admin-edit-dialog-footer">
            <el-button plain @click="adminEditVisible = false">取消</el-button>
            <el-button plain type="primary" @click="handleAdminEditSubmit">保存</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 密码修改对话框 -->
      <el-dialog v-model="passwordChangeVisible" title="密码修改" width="500px">
        <el-form ref="passwordChangeFormRef" :model="passwordChangeForm" label-width="100px">
          <el-form-item label="旧密码" prop="oldPassword" :required="true">
            <el-input v-model="passwordChangeForm.oldPassword" show-password style="width: 90%"/>
          </el-form-item>

          <el-form-item label="新密码" prop="newPassword" :required="true">
            <el-input v-model="passwordChangeForm.newPassword" show-password style="width: 90%"/>
          </el-form-item>

          <el-form-item label="确认密码" prop="confirmPassword" :required="true">
            <el-input v-model="passwordChangeForm.confirmPassword" show-password style="width: 90%">
            </el-input>
          </el-form-item>
        </el-form>

        <template #footer>
          <div class="admin-edit-dialog-footer">
            <el-button plain @click="passwordChangeVisible = false">取消</el-button>
            <el-button plain type="primary" @click="handlePasswordChangeSubmit">更改</el-button>
          </div>
        </template>
      </el-dialog>

    </el-container>
  </div>

  <!--  备案信息-->
  <div style="position: fixed; bottom: 0; left: 0; width: 100%; text-align: center; padding: 10px; background-color: #000;">
    <span style="display: inline-block;">
      <img src="../assets/备案图标.png" alt="" style="width: 14px; vertical-align: middle">
      <a href="https://beian.mps.gov.cn/#/query/webSearch?code=21021702000850"
         rel="noreferrer"
         target="_blank"
         style="font-size:13px; margin-left: 6px; text-decoration: none; color: white;"
         onmouseover="this.style.textDecoration='underline';this.style.color='#007bff'"
         onmouseout="this.style.textDecoration='none';this.style.color='white'">辽公网安备21021702000850号</a>
      <a href="https://beian.miit.gov.cn/"
         target="_blank"
         style="font-size:13px; margin-left: 20px; text-decoration: none; color: white;"
         onmouseover="this.style.textDecoration='underline';this.style.color='#007bff'"
         onmouseout="this.style.textDecoration='none';this.style.color='white'">辽ICP备2026000475号-1</a>
    </span>
  </div>
</template>

<script>
import {
  Box,
  Cellphone,
  ChatDotSquare, Check, Close, Coin,
  Comment, CopyDocument,
  Delete,
  Document,
  DocumentAdd,
  DocumentCopy,
  Download,
  Edit,
  Files,
  Filter,
  Folder,
  FolderAdd,
  FolderOpened, Grid,
  Histogram,
  HomeFilled,
  InfoFilled,
  Monitor,
  MostlyCloudy,
  OfficeBuilding,
  Operation,
  Picture, Platform,
  Plus,
  Promotion,
  RefreshLeft,
  Search,
  Setting,
  Switch,
  SwitchButton,
  Tools, TurnOff,
  UploadFilled,
  User,
  UserFilled,
  Warning
} from "@element-plus/icons-vue";
import axios from "axios";
import LineChart from "@/components/LineChart.vue";
import BarChart from "@/components/BarChart.vue";
import {ElLoading, ElMessage, ElNotification} from "element-plus";

export default {
  components: {
    Grid,
    Platform,
    CopyDocument,
    TurnOff,
    Coin,
    Filter,
    InfoFilled,
    Plus,
    DocumentCopy,
    Box,
    UserFilled,
    Setting,
    Tools,
    Cellphone,
    Monitor,
    OfficeBuilding,
    Operation,
    Switch,
    Warning,
    BarChart,
    LineChart,
    Histogram,
    Edit,
    DocumentAdd,
    Picture,
    Comment,
    Document,
    Folder,
    FolderAdd,
    RefreshLeft,
    UploadFilled,
    Search,
    MostlyCloudy,
    SwitchButton, FolderOpened, Download, Delete, HomeFilled, ChatDotSquare, Files, User, Promotion},

  data() {
    return {
      currentTime: '',
      timer: null,

      token: '',
      info: {
        id: 0,
        // avatar: '',  // 暂无
        username: '',
        email: ''
      },

      adminEditVisible: false,
      adminEditForm: {
        id: 0,
        username: '',
        email: ''
      },

      passwordChangeVisible: false,
      passwordChangeForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },

      userType: 0,
      op: 1,

      curDir: '/',

      moveFileId: 0,

      fileTableData: [],
      filePageInfo: {
        total: 0,
        size: 20,
        current: 1,
        pages: 0
      },

      searchTableVisible: false,
      searchData: [],
      searchKey: '',

      uploadDir: '',
      uploadFileList: [],
      uploadFilesTotal: 0,
      uploading: false,

      sayingTableData: [],
      allSayingTableData: [],
      sayingPageInfo: {
        total: 0,
        size: 20,
        current: 1,
        pages: 0
      },

      sayingSearchKey: '',

      sayingImportVisible: false,

      userTableData: [],
      allUserTableData: [],
      userPageInfo: {
        total: 0,
        size: 20,
        current: 1,
        pages: 0
      },

      userSearchKey: '',

      userImportVisible: false,

      userSettingVisible: false,
      userForm: {
        id: '',
        name: '',
        access: 0,
        level: 0,
        cash: 0,
        capacity: 100,
        drawTimes: 50
      },

      groupTableData: [],
      allGroupTableData: [],
      groupPageInfo: {
        total: 0,
        size: 20,
        current: 1,
        pages: 0
      },

      groupSearchKey: '',

      groupImportVisible: false,

      groupSettingVisible: false,
      groupForm: {
        id: '',
        name: '',
        access: 0,
      },

      groupFuncVisible: false,
      groupFuncForm: {
        groupId: '',

        scope: null,
        antiInjection: false,
        thinking: false,
        voice: false,
        embedding: false,
        embeddingAuth: false,
        custom: false,
        autoReply: false,
        replyFrequency: 0.01,

        imageCollect: false,
        messageCollect: false,
        keywordDetect: false,
        pokeDetect: false,
        recallDetect: false,

        guessRatio: 0.1,
        guessPadding: 250
      },

      funcImportVisible: false,

      itemTableData: [],
      allItemTableData: [],
      itemPageInfo: {
        total: 0,
        size: 20,
        current: 1,
        pages: 0
      },

      itemSearchRarity: null,
      itemSearchCategory: null,
      itemSearchKey: '',

      itemImportVisible: false,

      itemSettingVisible: false,
      itemAddingVisible: false,
      itemForm: {
        id: '',
        name: '',
        rarity: null,
        category: null,
        price: '',
        weight: '',
        description: '',
        command: '',
        imagePath: '',
        available: false,
      },

      inventoriesVisible: false,
      inventoriesData: [],
      inventoriesUserId: '',
      inventoriesTitle: '',

      inventorySettingVisible: false,
      newItemId: '',
      inventoryForm: {
        id: '',
        ownerId: '',
        itemId: '',
        itemName: '',
        category: null,
        rarity: null,
        price: '',
        amount: ''
      },

      inventoryImportVisible: false,

      previewVisible: false, // 控制预览对话框显示
      previewUrl: '', // 预览文件的完整URL
      previewType: '', // 'image' 或 'video' 或 'audio'
      previewTitle: '', // 预览对话框标题

      totalVisits: 0,
      visitsData: [],
      visitsXAxis: [],
      topGroupsData:[],
      topGroupsAxis: [],
      topUsersData: [],
      topUsersAxis: [],
      topCommandsData: [],
      topCommandsAxis: [],

      invokeCommand: '',
      invokeResult: ''
    }
  },

  computed: {

    Check() {
      return Check
    },

    Close() {
      return Close
    },

    Box() {
      return Box
    },

    Search() {
      return Search
    },

    hasItemFilter() {
      return this.itemSearchCategory !== null || this.itemSearchRarity !== null || this.itemSearchKey !== ''
    },

    filteredItemTableData() {
      if(this.hasItemFilter) {
        return this.allItemTableData.filter(item => {
          // 类别过滤
          const categoryMatch = this.itemSearchCategory === null || item.category === this.itemSearchCategory
          // 品质过滤
          const rarityMatch = this.itemSearchRarity === null || item.rarity === this.itemSearchRarity
          // 关键词过滤
          const keyMatch = this.itemSearchKey === '' || item.name.includes(this.itemSearchKey)
          return categoryMatch && rarityMatch && keyMatch
        });
      } else {
        return this.itemTableData
      }
    },

    hasSayingFilter() {
      return this.sayingSearchKey !== ''
    },

    filteredSayingTableData() {
      if(this.hasSayingFilter) {
        return this.allSayingTableData.filter(saying => {
          // 关键词过滤
          return this.sayingSearchKey === '' ||
              String(saying.userId).includes(this.sayingSearchKey) || saying.userName.includes(this.sayingSearchKey) || saying.text.includes(this.sayingSearchKey)
        });
      } else {
        return this.sayingTableData
      }
    },

    hasUserFilter() {
      return this.userSearchKey !== ''
    },

    filteredUserTableData() {
      if(this.hasUserFilter) {
        return this.allUserTableData.filter(user => {
          // 关键词过滤
          return this.userSearchKey === '' ||
              String(user.id).includes(this.userSearchKey) || user.name.includes(this.userSearchKey)
        });
      } else {
        return this.userTableData
      }
    },

    hasGroupFilter() {
      return this.groupSearchKey !== ''
    },

    filteredGroupTableData() {
      if(this.hasGroupFilter) {
        return this.allGroupTableData.filter(group => {
          // 关键词过滤
          return this.groupSearchKey === '' ||
              String(group.id).includes(this.groupSearchKey) || group.name.includes(this.groupSearchKey)
        });
      } else {
        return this.groupTableData
      }
    },

    uploadHeaders() {
      const token = localStorage.getItem('token') || ''
      return {
        token: `${token}`
        // 或者根据后端要求使用其他格式：
        // 'Authorization': token
        // 'X-Auth-Token': token
        // 'token': token
      }
    }
  },

  methods: {

    uploadAction(url) {
      const baseURL = axios.defaults.baseURL || ''
      return `${baseURL}${url}`
    },

    isCsv(file) {
      // // 方法1：通过文件扩展名验证
      // const isCSVByExt = file.name.toLowerCase().endsWith('.csv')
      // // 方法2：通过MIME类型验证（注意：不同浏览器可能返回不同的MIME类型）
      // const allowedMimeTypes = [
      //   'text/csv',
      //   'application/vnd.ms-excel', // 一些旧版Excel
      //   'application/csv',
      //   'text/x-csv',
      //   'text/comma-separated-values',
      //   'text/plain' // 有些CSV文件可能被识别为text/plain
      // ]
      // const isCSVByMime = allowedMimeTypes.includes(file.type)
      // // 方法3：结合扩展名和MIME类型
      // if (!isCSVByExt) {
      //   this.$message.error('只能上传 CSV 格式的文件！')
      //   return false
      // }
      // // 如果扩展名通过但MIME类型不符合，给出警告但允许上传
      // if (!isCSVByMime) {
      //   console.warn(`文件 ${file.name} 的MIME类型为 ${file.type}，不是标准的CSV类型`)
      // }
      // return true

      const isCSVByExt = file.name.toLowerCase().endsWith('.csv')
      if (!isCSVByExt) {
        this.$message.error('仅支持 CSV 文件')
        return false
      }
      return true
    },

    // 时钟更新
    updateTime() {
      const now = new Date()
      this.currentTime = now.toLocaleTimeString('zh-CN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    },

    // 从文件名获取文件扩展名
    getFileExtension(fileName) {
      if (!fileName) return '未知类型'
      // 获取最后一个点之后的部分作为文件扩展名
      const lastDotIndex = fileName.lastIndexOf('.')
      if (lastDotIndex === -1 || lastDotIndex === fileName.length - 1) {
        return '未知类型'
      }
      // 获取后缀并转为小写
      const extension = fileName.substring(lastDotIndex + 1).toLowerCase()
      // 如果后缀太长，可以截断显示
      return extension.length > 8 ? extension.substring(0, 8) + '...' : extension
    },

    // 判断文件是否可预览（根据扩展名）
    isPreviewable(file) {
      if (file.isDir === 1) return false; // 文件夹不可预览
      const fileName = file.fileName.toLowerCase();
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
      const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
      const audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a', '.wma', '.opus'];
      return imageExtensions.some(ext => fileName.endsWith(ext)) ||
          videoExtensions.some(ext => fileName.endsWith(ext)) ||
          audioExtensions.some(ext => fileName.endsWith(ext));
    },

    // 处理预览点击事件
    handlePreview(file) {
      // 1. 构造文件预览URL（需要后端的支持）
      const baseUrl = axios.defaults.baseURL + '/preview/';
      this.previewUrl = baseUrl + file.id + '?token=' + localStorage.getItem("token");

      // 2. 判断文件类型
      const fileName = file.fileName.toLowerCase();
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
      const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
      this.previewType = imageExtensions.some(ext => fileName.endsWith(ext)) ? 'image' : (videoExtensions.some(ext => fileName.endsWith(ext)) ? 'video' : 'audio');

      // 3. 设置对话框标题
      this.previewTitle = `预览 - ${file.fileName}`;

      // 4. 打开对话框
      this.previewVisible = true;
    },

    getStatistic() {
      this.$axios.get('/statistic', {
        headers: {
          token: localStorage.getItem("token")
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.totalVisits = res.data.data.totalVisits
          this.visitsXAxis = res.data.data.visitsXAxis
          this.visitsData = res.data.data.visitsData
          this.topGroupsAxis = res.data.data.topGroupsAxis
          this.topGroupsData = res.data.data.topGroupsData
          this.topUsersAxis = res.data.data.topUsersAxis
          this.topUsersData = res.data.data.topUsersData
          this.topCommandsAxis = res.data.data.topCommandsAxis
          this.topCommandsData = res.data.data.topCommandsData
          console.log(this.visitsXAxis)
        } else if (res.data.code === 400) {
          this.$message.error(res.data.message)
        }
      })
    },

    getInfo() {
      this.$axios.get('/info', {
        headers: {
          token: localStorage.getItem("token")
        }
      }).then(res => {
        if (res.data.code === 200) {
          let info = res.data.data.info
          this.info = JSON.parse(JSON.stringify(info))
          this.userType = res.data.data.userType
        } else if (res.data.code === 400) {
          this.$message.error(res.data.message)
        }
      })
    },

    copyCurDir() {
      const text = this.curDir;

      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999px";
      textArea.style.top = "-999px";
      document.body.appendChild(textArea);

      textArea.focus();
      textArea.select();

      try {
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text)
              .then(() => {
                ElMessage.success("路径已复制");
              })
              .catch(() => {
                if (document.execCommand('copy')) {
                  ElMessage.success("路径已复制");
                } else {
                  throw new Error('复制失败');
                }
              });
        } else if (document.execCommand('copy')) {
          ElMessage.success("路径已复制");
        } else {
          prompt("请手动复制以下路径：", text);
        }
      } catch (err) {
        ElMessage.warning("复制失败");
      } finally {
        document.body.removeChild(textArea);
      }
    },

    handleFileCurrentChange(currentPage) {
      this.getFilePage(currentPage, this.filePageInfo.size)
    },

    handleFileSizeChange(pageSize) {
      this.getFilePage(1, pageSize)
    },

    handleSayingCurrentChange(currentPage) {
      this.getSayingPage(currentPage, this.sayingPageInfo.size)
      this.getSayingList()
    },

    handleSayingSizeChange(pageSize) {
      this.getSayingPage(1, pageSize)
      this.getSayingList()
    },

    handleUserCurrentChange(currentPage) {
      this.getUserPage(currentPage, this.userPageInfo.size)
      this.getUserList()
    },

    handleUserSizeChange(pageSize) {
      this.getUserPage(1, pageSize)
      this.getUserList()
    },

    handleGroupCurrentChange(currentPage) {
      this.getGroupPage(currentPage, this.groupPageInfo.size)
      this.getGroupList()
    },

    handleGroupSizeChange(pageSize) {
      this.getGroupPage(1, pageSize)
      this.getGroupList()
    },

    handleItemCurrentChange(currentPage) {
      this.getItemPage(currentPage, this.itemPageInfo.size)
      this.getItemList()
    },

    handleItemSizeChange(pageSize) {
      this.getItemPage(1, pageSize)
      this.getItemList()
    },

    shiftMenu(op) {
      this.op = op
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    getFilePage(currentPage, pageSize) {
      this.$axios({
        url: '/file/page/' + currentPage + '/' + pageSize,
        headers: {
          'token': localStorage.getItem("token")
        },
        method: 'GET',
        params: {
          curDir: this.curDir,
        }
      }).then(res => {
        this.fileTableData = JSON.parse(JSON.stringify(res.data.data.filePage.files))
        this.filePageInfo.total = res.data.data.filePage.total
        this.filePageInfo.size = res.data.data.filePage.pageSize
        this.filePageInfo.current = res.data.data.filePage.currentPage
        this.filePageInfo.pages = res.data.data.filePage.totalPage
      })
    },

    searchFile() {
      this.$axios({
        url: '/file/searchFile',
        headers: {
          'token': localStorage.getItem("token")
        },
        method: 'GET',
        params: {
          key: this.searchKey,
          curDir: this.curDir,
        }
      }).then(res => {
        this.searchData = JSON.parse(JSON.stringify(res.data.data.filePage.files))
        this.searchTableVisible = true
        console.log('searchData:')
        console.log(this.searchData)
      })
    },

    deleteFile(file) {
      this.$axios.delete('/file/delete/' + file.id, {
        headers: {
          token: localStorage.getItem("token")
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message)
          this.getFilePage(this.filePageInfo.current, this.filePageInfo.size)
          if (this.searchTableVisible === true) {
            this.searchFile(this.searchKey, this.curDir)
          }
        } else {
          this.$message.error(`${file.fileName} - ${res.data.message}`)
        }
      }).catch(() => {
        this.$message.error("删除失败!")
      })
    },

    async upload() {
      if (this.uploadFileList.length === 0) {
        this.$message.warning("未选择文件")
        return
      }

      this.uploadDir = this.curDir
      this.uploadFilesTotal = 0
      this.uploading = true
      for (let fileObj of this.uploadFileList) {
        try {
          let formData = new FormData()
          formData.append("uploadFile", fileObj.raw)
          formData.append("curDir", this.curDir)
          // 等待当前文件上传完成
          const res = await this.$axios.post("/file/upload", formData, {
            headers: {
              // "Content-Type": "multipart/form-data;charset=utf-8",
              token: localStorage.getItem("token")
            },
            timeout: 300000, // 5分钟超时
            maxContentLength: Infinity,
          })
          if (res.data.code === 200) {
            this.$message.success(`${fileObj.name} - 上传成功`)
          } else {
            this.$message.error(`${fileObj.name} - ${res.data.message}`)
          }
        } catch (err) {
          console.error("上传失败:", err)
          this.$message.error( `${fileObj.name} - Exception: ${err}`)
        }
        this.uploadFilesTotal++
      }

      // 所有文件上传后清空文件列表
      this.uploadFileList = []
      this.$refs.upload.clearFiles()
      // 刷新页面数据
      if(this.curDir === this.uploadDir){
        if (this.filePageInfo.pages === 0) {
          this.getFilePage(1, this.filePageInfo.size)
        } else {
          this.getFilePage(this.filePageInfo.pages, this.filePageInfo.size)
        }
      }
      this.uploading = false
    },

    handleFileChange(file, fileList) {
      this.uploadFileList = fileList;
    },

    download(file) {
      this.$axios.get("/file/download/" + file.id, {
        responseType: "arraybuffer",
        headers: {
          token: localStorage.getItem("token")
        },
      }).then(res => {
        const blob = new Blob([res.data]);
        const elink = document.createElement('a');
        elink.download = file.fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        this.$message.success('下载成功');
      }).catch(err => {
        this.$message.error('下载失败');
      })
    },

    enterDir(dir) {
      if (this.curDir === "/") {
        this.curDir += dir.fileName
      } else {
        this.curDir += "/" + dir.fileName
      }
      this.getFilePage(1, this.filePageInfo.size)
      this.searchTableVisible = false
    },

    backDir() {
      if (this.curDir === "/") {
        this.$message.error("已在根目录")
      } else {
        let index = this.curDir.lastIndexOf('/')
        if (index === 0) {
          this.curDir = "/"
        } else {
          this.curDir = this.curDir.substring(0, index)
        }
      }
      this.getFilePage(1, this.filePageInfo.size)
    },

    createDir() {
      this.$prompt('请输入目录名', '新建目录', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^(?!.*(\/)|(\\))/,
        inputErrorMessage: "目录名不能包含斜杠"
      }).then(({ value }) => {
        if (!value) {
          this.$message({
            type: 'error',
            message: '目录名不能为空'
          });
        } else {
          this.$axios.post('/file/createDir', {
            curDir: this.curDir !== '' ? this.curDir : '/',
            dirName: value
          }, {
            headers: {
              token: localStorage.getItem("token")
            }
          }).then(res => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: value + '创建成功!'
              })
              this.getFilePage(this.filePageInfo.current, this.filePageInfo.size)
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              });
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消创建'
        });
      });
    },

    handleRename(file) {
      this.$prompt('请输入新的文件名', '重命名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: file.fileName,
        inputPattern: /^[^\\\/:*?"<>|]+$/,
        inputErrorMessage: '名称非法：文件名不能包含 \\ / : * ? " < > | 等字符'
      }).then(({ value }) => {
        if (!value || value.trim() === '') {
          this.$message.error('文件名不能为空');
          return;
        }
        if (value === file.fileName) {
          this.$message.warning('文件名未更改');
          return;
        }
        this.$axios({
          url: `/file/rename/${file.id}`,
          method: 'GET',
          headers: {
            'token': localStorage.getItem("token")
          },
          params: {
            newFileName: value
          }
        }).then(res => {
          if (res.data.code === 200) {
            // 刷新当前视图
            this.getFilePage(this.filePageInfo.current, this.filePageInfo.size);
            if (this.searchTableVisible) {
              this.searchFile();
            }
            this.$message.success('重命名成功');
          } else {
            this.$message.error(`${file.fileName} - ${res.data.message}`);
          }
        }).catch(err => {
          this.$message.error('重命名失败');
        });
      }).catch(() => {
        this.$message.info('已取消重命名');
      });
    },

    handleMove(file) {
      this.$prompt('请输入移动至的目录路径', '移动文件', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: this.curDir,
        inputPattern: /^\/$|^\/([^\/]+\/)*[^\/]+$/,
        inputErrorMessage: '路径非法：非空且不能有连续 / 且除根外不能以 / 结尾'
      }).then(({ value }) => {
        if (!value || value.trim() === '') {
          this.$message.error('路径不能为空');
          return;
        }
        if (value === this.curDir) {
          this.$message.warning('路径未更改');
          return;
        }
        this.$axios({
          url: `/file/move/${file.id}`,
          method: 'GET',
          headers: {
            'token': localStorage.getItem("token")
          },
          params: {
            newDir: value
          }
        }).then(res => {
          if (res.data.code === 200) {
            // 刷新当前视图
            this.getFilePage(this.filePageInfo.current, this.filePageInfo.size);
            if (this.searchTableVisible) {
              this.searchFile();
            }
            this.$message.success('移动成功');
          } else {
            this.$message.error(`${res.data.message}`);
          }
        }).catch(err => {
          this.$message.error('移动失败');
        });
      }).catch(() => {
        this.$message.info('已取消移动');
      });
    },

    changeFileVisible(row) {
      return new Promise((resolve, reject) => {
        try {
          row._loading = true
          this.$axios({
            url: `file/setVisible/${row.id}`,
            method: 'GET',
            headers: {
              'token': localStorage.getItem("token")
            },
            params: {
              visible: !row.visible
            }
          }).then(res => {
            if (res.data.code === 200) {
              // 刷新当前视图
              this.getFilePage(this.filePageInfo.current, this.filePageInfo.size);
              if (this.searchTableVisible) {
                this.searchFile();
              }
              // row._loading = false
              this.$message.success('修改成功');
              return resolve(true)
            } else {
              // row._loading = false
              this.$message.error('修改失败');
              return reject(false)
            }
          })
        } catch(err) {
          // row._loading = false
          this.$message.error('请求失败');
          reject(false)
        }
      })
    },

    refreshSaying() {
      this.getSayingList()
      this.getSayingPage(this.sayingPageInfo.current, this.sayingPageInfo.size)
    },

    getSayingList() {
      this.$axios({
        url: '/saying/list',
        headers: {
          'token': localStorage.getItem("token")
        },
        method: 'GET'
      }).then(res => {
        this.allSayingTableData = JSON.parse(JSON.stringify(res.data.data.sayings))
      })
    },

    getSayingPage(currentPage, pageSize) {
      this.$axios({
        url: '/saying/page/' + currentPage + '/' + pageSize,
        headers: {
          'token': localStorage.getItem("token")
        },
        method: 'GET'
      }).then(res => {
        this.sayingTableData = JSON.parse(JSON.stringify(res.data.data.sayingPage.sayings))
        this.sayingPageInfo.total = res.data.data.sayingPage.total
        this.sayingPageInfo.size = res.data.data.sayingPage.pageSize
        this.sayingPageInfo.current = res.data.data.sayingPage.currentPage
        this.sayingPageInfo.pages = res.data.data.sayingPage.totalPage
      })
    },

    deleteSaying(saying) {
      this.$axios.delete('/saying/delete/' + saying.id, {
        headers: {
          token: localStorage.getItem("token")
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message)
          this.refreshSaying()
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(() => {
        this.$message.error("删除失败!")
      })
    },

    exportSayingCsv() {
      this.$axios({
        url: '/saying/exportCsv',
        headers: {
          'token': localStorage.getItem("token")
        },
        method: 'GET'
      }).then(res => {
        const blob = new Blob([res.data]);
        const elink = document.createElement('a');
        elink.download = `Sayings_${new Date().toLocaleString()}.csv`;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放 URL 对象
        document.body.removeChild(elink);
        this.$message.success("导出成功")
      }).catch(error => {
        this.$message.error("导出失败")
      });
    },

    refreshUser() {
      this.getUserList()
      this.getUserPage(this.userPageInfo.current, this.userPageInfo.size)
    },

    getUserList() {
      this.$axios({
        url: '/user/list',
        headers: {
          'token': localStorage.getItem("token")
        },
        method: 'GET'
      }).then(res => {
        this.allUserTableData = JSON.parse(JSON.stringify(res.data.data.users))
      })
    },

    getUserPage(currentPage, pageSize) {
      this.$axios({
        url: '/user/page/' + currentPage + '/' + pageSize,
        headers: {
          'token': localStorage.getItem("token")
        },
        method: 'GET'
      }).then(res => {
        this.userTableData = JSON.parse(JSON.stringify(res.data.data.userPage.users))
        this.userPageInfo.total = res.data.data.userPage.total
        this.userPageInfo.size = res.data.data.userPage.pageSize
        this.userPageInfo.current = res.data.data.userPage.currentPage
        this.userPageInfo.pages = res.data.data.userPage.totalPage
      })
    },

    deleteUser(user) {
      this.$axios.delete('/user/delete/' + user.id, {
        headers: {
          token: localStorage.getItem("token")
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message)
          this.refreshUser()
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(() => {
        this.$message.error("删除失败!")
      })
    },

    handleUserSetting(row) {
      // 深拷贝row对象，避免修改原数据
      this.userForm = JSON.parse(JSON.stringify(row))
      this.userSettingVisible = true
    },

    handleUserSettingSubmit() {
      this.$axios({
        url: '/user/update',
        headers: {
          'token': localStorage.getItem("token"),
          'Content-Type': 'application/json'
        },
        data: this.userForm,
        method: 'PUT'
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message)
          this.refreshUser()
          this.userSettingVisible = false
        } else {
          this.$message.error(res.data.message)
        }
      })
    },

    exportUserCsv() {
      this.$axios({
        url: '/user/exportCsv',
        headers: {
          'token': localStorage.getItem("token")
        },
        method: 'GET'
      }).then(res => {
        const blob = new Blob([res.data]);
        const elink = document.createElement('a');
        elink.download = `Users_${new Date().toLocaleString()}.csv`;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放 URL 对象
        document.body.removeChild(elink);
        this.$message.success("导出成功")
      }).catch(error => {
        this.$message.error("导出失败")
      });
    },

    refreshGroup() {
      this.getGroupList()
      this.getGroupPage(this.groupPageInfo.current, this.groupPageInfo.size)
    },

    getGroupList() {
      this.$axios({
        url: '/group/list',
        headers: {
          'token': localStorage.getItem("token")
        },
        method: 'GET'
      }).then(res => {
        this.allGroupTableData = JSON.parse(JSON.stringify(res.data.data.groups))
      })
    },

    getGroupPage(currentPage, pageSize) {
      this.$axios({
        url: '/group/page/' + currentPage + '/' + pageSize,
        headers: {
          'token': localStorage.getItem("token")
        },
        method: 'GET'
      }).then(res => {
        this.groupTableData = JSON.parse(JSON.stringify(res.data.data.groupPage.groups))
        this.groupPageInfo.total = res.data.data.groupPage.total
        this.groupPageInfo.size = res.data.data.groupPage.pageSize
        this.groupPageInfo.current = res.data.data.groupPage.currentPage
        this.groupPageInfo.pages = res.data.data.groupPage.totalPage
      })
    },

    deleteGroup(group) {
      this.$axios.delete('/group/delete/' + group.id, {
        headers: {
          token: localStorage.getItem("token")
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message)
          this.refreshGroup()
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(() => {
        this.$message.error("删除失败!")
      })
    },

    handleGroupSetting(row) {
      // 深拷贝row对象，避免修改原数据
      this.groupForm = JSON.parse(JSON.stringify(row))
      this.groupSettingVisible = true
    },

    handleGroupSettingSubmit() {
      this.$axios({
        url: '/group/update',
        headers: {
          'token': localStorage.getItem("token"),
          'Content-Type': 'application/json'
        },
        data: this.groupForm,
        method: 'PUT'
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message)
          this.refreshGroup()
          this.groupSettingVisible = false
        } else {
          this.$message.error(res.data.message)
        }
      })
    },

    handleGroupFunc(row) {
      this.$axios({
        url: '/setting/' + row.id,
        headers: {
          'token': localStorage.getItem("token"),
          'Content-Type': 'application/json'
        },
        method: 'GET'
      }).then(res => {
        if (res.data.code === 200) {
          this.groupFuncForm = JSON.parse(JSON.stringify(res.data.data.setting));
          this.groupFuncVisible = true
        } else {
          this.$message.error(res.data.message)
        }
      })
    },

    handleGroupFuncSubmit() {
      this.$axios({
        url: '/setting/set',
        headers: {
          'token': localStorage.getItem("token"),
          'Content-Type': 'application/json'
        },
        data: this.groupFuncForm,
        method: 'PUT'
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message)
          this.groupFuncVisible = false
        } else {
          this.$message.error(res.data.message)
        }
      })
    },

    exportGroupCsv() {
      this.$axios({
        url: '/group/exportCsv',
        headers: {
          'token': localStorage.getItem("token")
        },
        method: 'GET'
      }).then(res => {
        const blob = new Blob([res.data]);
        const elink = document.createElement('a');
        elink.download = `Groups_${new Date().toLocaleString()}.csv`;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放 URL 对象
        document.body.removeChild(elink);
        this.$message.success("导出成功")
      }).catch(error => {
        this.$message.error("导出失败")
      });
    },

    exportFuncCsv() {
      this.$axios({
        url: '/setting/exportCsv',
        headers: {
          'token': localStorage.getItem("token")
        },
        method: 'GET'
      }).then(res => {
        const blob = new Blob([res.data]);
        const elink = document.createElement('a');
        elink.download = `Settings_${new Date().toLocaleString()}.csv`;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放 URL 对象
        document.body.removeChild(elink);
        this.$message.success("导出成功")
      }).catch(error => {
        this.$message.error("导出失败")
      });
    },

    refreshItem() {
      this.getItemList()
      this.getItemPage(this.itemPageInfo.current, this.itemPageInfo.size)
    },

    getItemList() {
      this.$axios({
        url: '/item/list',
        headers: {
          'token': localStorage.getItem("token")
        },
        method: 'GET'
      }).then(res => {
        this.allItemTableData = JSON.parse(JSON.stringify(res.data.data.items))
      })
    },

    getItemPage(currentPage, pageSize) {
      this.$axios({
        url: '/item/page/' + currentPage + '/' + pageSize,
        headers: {
          'token': localStorage.getItem("token")
        },
        method: 'GET'
      }).then(res => {
        this.itemTableData = JSON.parse(JSON.stringify(res.data.data.itemPage.items))
        this.itemPageInfo.total = res.data.data.itemPage.total
        this.itemPageInfo.size = res.data.data.itemPage.pageSize
        this.itemPageInfo.current = res.data.data.itemPage.currentPage
        this.itemPageInfo.pages = res.data.data.itemPage.totalPage
      })
    },

    handleItemSetting(row) {
      // 深拷贝row对象，避免修改原数据
      this.itemForm = JSON.parse(JSON.stringify(row))
      this.itemSettingVisible = true
    },

    handleItemSettingSubmit() {
      this.$axios({
        url: '/item/update',
        headers: {
          'token': localStorage.getItem("token"),
          'Content-Type': 'application/json'
        },
        data: this.itemForm,
        method: 'PUT'
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message)
          this.refreshItem()
          this.itemSettingVisible = false
        } else {
          this.$message.error(res.data.message)
        }
      })
    },

    handleItemAdding() {
      this.itemForm = {
        id: '',
        name: '',
        rarity: null,
        category: null,
        price: '',
        weight: '',
        description: '',
        command: '',
        imagePath: '',
        available: false,
      }
      this.itemAddingVisible = true
    },

    handleItemAddingSubmit() {
      this.$axios({
        url: '/item/add',
        headers: {
          'token': localStorage.getItem("token"),
          'Content-Type': 'application/json'
        },
        data: this.itemForm,
        method: 'POST'
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message)
          this.refreshItem()
          this.itemAddingVisible = false
        } else {
          this.$message.error(res.data.message)
        }
      })
    },

    deleteItem(item) {
      this.$axios.delete('/item/delete/' + item.id, {
        headers: {
          token: localStorage.getItem("token")
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message)
          this.refreshItem()
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(() => {
        this.$message.error("删除失败!")
      })
    },

    exportItemCsv() {
      this.$axios({
        url: '/item/exportCsv',
        headers: {
          'token': localStorage.getItem("token")
        },
        method: 'GET'
      }).then(res => {
        const blob = new Blob([res.data]);
        const elink = document.createElement('a');
        elink.download = `Items_${new Date().toLocaleString()}.csv`;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放 URL 对象
        document.body.removeChild(elink);
        this.$message.success("导出成功")
      }).catch(error => {
        this.$message.error("导出失败")
      });
    },

    handleInventories(row) {
      this.inventoriesUserId = row.id
      this.inventoriesTitle = `库存 - ${row.name}`
      this.newItemId = ''
      this.getInventoryList(row.id)
      this.inventoriesVisible = true
    },

    getInventoryList(id) {
      this.$axios({
        url: '/inventory/list',
        headers: {
          'token': localStorage.getItem("token")
        },
        method: 'GET',
        params: {
          userId: id
        }
      }).then(res => {
        this.inventoriesData = JSON.parse(JSON.stringify(res.data.data.inventories))
      })
    },

    deleteInventory(inventory) {
      this.$axios.delete('/inventory/delete/' + inventory.id, {
        headers: {
          token: localStorage.getItem("token")
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message)
          this.getInventoryList(inventory.ownerId)
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(() => {
        this.$message.error("删除失败!")
      })
    },

    handleInventorySetting(row) {
      // 深拷贝row对象，避免修改原数据
      this.inventoryForm = JSON.parse(JSON.stringify(row))
      this.inventorySettingVisible = true
    },

    handleInventorySettingSubmit() {
      this.$axios({
        url: '/inventory/update',
        headers: {
          'token': localStorage.getItem("token"),
          'Content-Type': 'application/json'
        },
        data: this.inventoryForm,
        method: 'PUT'
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message)
          this.getInventoryList(this.inventoryForm.ownerId)
          this.inventorySettingVisible = false
        } else {
          this.$message.error(res.data.message)
        }
      })
    },

    addInventory(userId, itemid) {
      this.$axios({
        url: '/inventory/add',
        headers: {
          'token': localStorage.getItem("token"),
          'Content-Type': 'application/json'
        },
        method: 'POST',
        params: {
          userId: userId,
          itemId: itemid
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message)
          this.getInventoryList(userId)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },

    exportInventoryCsv() {
      this.$axios({
        url: '/inventory/exportCsv',
        headers: {
          'token': localStorage.getItem("token")
        },
        method: 'GET'
      }).then(res => {
        const blob = new Blob([res.data]);
        const elink = document.createElement('a');
        elink.download = `Inventories_${new Date().toLocaleString()}.csv`;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放 URL 对象
        document.body.removeChild(elink);
        this.$message.success("导出成功")
      }).catch(error => {
        this.$message.error("导出失败")
      });
    },

    initRootFile() {
      this.$axios.get('/file/init', {
        headers: {
          token: localStorage.getItem("token")
        }
      }).then(res => {
        if (res.data.code === 200) {
          ElMessage({
            message: 'Root 文件 - 初始化完成',
            type: 'success',
            placement: 'bottom-left',
          })
        } else if (res.data.code === 400) {
          ElMessage({
            message: 'Root 文件 - 已初始化过',
            type: 'warning',
            placement: 'bottom-left',
          })
        }
      })
    },

    sync() {
      const loading = ElLoading.service({
        lock: true,
        text: '同步中...',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      this.$axios.get('/file/sync', {
        headers: {
          token: localStorage.getItem("token")
        }
      }).then(res => {
        if (res.data.code === 200) {
          ElMessage({
            message: '本地与数据库 - 已同步',
            type: 'success',
            placement: 'bottom-left',
          })
        } else if (res.data.code === 400) {
          ElMessage({
            message: '本地与数据库 - 同步失败',
            type: 'error',
            placement: 'bottom-left',
          })
        }
      })
          .then(() => this.getInfo())
          .then(() => this.getStatistic())
          .then(() => this.getFilePage(this.filePageInfo.current, this.filePageInfo.size))
          .then(() => this.refreshSaying())
          .then(() => this.refreshUser())
          .then(() => this.refreshGroup())
          .then(() => this.refreshItem())
          .then(() => {
            loading.close()
            ElMessage({
              message: '全部浏览数据 - 已更新',
              type: 'success',
              placement: 'bottom-left',
            })
          })
          .catch(error => {
            loading.close()
            ElMessage({
              message: "同步更新异常: " + (error.message || '未知错误'),
              type: 'error',
              placement: 'bottom-left',
            })
          })
    },

    deleteAdmin() {
      this.$axios.delete('/delete', {
        headers: {
          token: localStorage.getItem("token")
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message)
          localStorage.clear()
          this.$router.push('/login')
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        this.$message.error("注销失败: " + (err.message || '未知错误'))
      })
    },

    handlePasswordChange() {
      this.passwordChangeForm = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      this.passwordChangeVisible = true
    },

    handlePasswordChangeSubmit() {
      this.$axios.post('/changePwd', this.passwordChangeForm, {
        headers: {
          token: localStorage.getItem("token")
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message)
          this.passwordChangeVisible = false
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        this.$message.error("更改失败: " + (err.message || '未知错误'))
      })
    },

    handleAdminEdit() {
      // 深拷贝info对象，避免修改原数据
      this.adminEditForm = JSON.parse(JSON.stringify(this.info))
      this.adminEditVisible = true
    },

    handleAdminEditSubmit() {
      this.$axios.post('/update', this.adminEditForm, {
        headers: {
          token: localStorage.getItem("token")
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.getInfo()
          this.$message.success(res.data.message)
          this.adminEditVisible = false
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        this.$message.error("更新失败: " + (err.message || '未知错误'))
      })
    },

    logout() {
      localStorage.clear()
      this.$router.push('/login')
    },

    invoke() {
      this.$axios.get('/system/invoke', {
        headers: {
          token: localStorage.getItem("token")
        },
        params: {
          command: this.invokeCommand
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message)
        } else {
          this.$message.error(res.data.message)
        }
        this.invokeResult = this.invokeResult + res.data.data.result  + '\n'
      }).catch(err => {
        this.$message.error("失败: " + (err.message || '未知错误'))
      })
    }
  },

  created() {
    this.token = localStorage.getItem("token");
    if (this.token === null) {
      this.$router.push('/login')
      return
    }
    this.sync()
  },

  mounted() {
    this.updateTime()
    this.timer = setInterval(this.updateTime, 1000)
  },

  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },

  watch: {
    // 监听op变化
    op(newVal) {
      if (newVal === 4) {
        this.getStatistic()
      } else if (newVal === 1){
        this.getFilePage(this.filePageInfo.current, this.filePageInfo.size)
      } else if (newVal === 3){
        this.refreshSaying()
      } else if (newVal === 5){
        this.refreshUser()
      } else if (newVal === 6){
        this.refreshGroup()
      } else if (newVal === 7){
        this.refreshItem()
      }
    }
  }
}
</script>

<style scoped>
/* 悬浮上传列表 */
::v-deep .upload .el-upload-list {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 9999;
  width: 300px;
  max-height: 300px;
  overflow-y: auto;
  border-radius: 4px;
  background: #141414;
  margin-top: 5px;
}

/* 确保父容器有相对定位 */
.upload {
  position: relative;
  display: inline-block;
}

/* el-statistic相关样式 */
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 295px;
  width: 10%;
  margin-left: 36px;
  margin-top: 0;
  margin-bottom: 25px;
  padding: 25px;
  border-radius: 8px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}
.red {
  color: var(--el-color-error);
}

/* 自定义滚动条样式 (暂弃) */
.custom-scrollbar {
  scrollbar-width: thin; /* Firefox 细滚动条 */
  scrollbar-color: #333333 #121212; /* Firefox 滑块颜色和轨道颜色 */
}


/* 自定义库存对话框Footer样式 */
.inventories-dialog-footer {
  display: flex;
  align-items: flex-end; /* 或 center 根据垂直对齐需求 */
  justify-content: flex-start;
  gap: 16px; /* 元素间距 */
}

/* 如果需要让表单项和按钮在底部对齐 */
.inventories-dialog-footer ::v-deep .el-form-item {
  margin-bottom: 0;
  flex: 1; /* 让表单项占据剩余空间 */
}

/* 自定义功能设置对话框样式 */

.function-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.function-section {
  border: 1px solid #555555;
  border-radius: 8px;
  padding: 16px;

  transition: all 0.3s ease;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #555555;
}

.section-header .el-icon {
  color: #409eff;
  font-size: 15px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
}

.group-func-dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
}
</style>
