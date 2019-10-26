<template id="news">
  <div class="block" style="width:70%;margin-left:8%;margin-top:10px">
    <el-tree
      :data="dataTree"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false">
		      <span class="lxl-custom-tree-node" slot-scope="{ node, data }">
		        <span>
		          <el-tag type="info" :class="data.sclass">
		          {{ node.label }}</el-tag>
		          <el-button v-if="data.add" type="success" icon="el-icon-plus" size="mini" circle @click="append(data)"></el-button>
		        </span>
		        <span>
	              <el-button type="text" style="font-size:13px" size="mini" @click="lookAndEdit(node, data)" :disabled="data.disable">  查看&编辑</el-button>
	              <el-button type="text" size="mini" style="font-size:14px" @click="remove(node, data)">
	               删除节点</el-button>
		        </span>
		      </span>
    </el-tree>
  </div>


</template>

<script>
  export default {
    data() {

      const data = [{
        id: 1,
        label: 'Service',
        sclass: 'ali-icon-zuzhixiaxia',
        add: false,
        disable: true,
        children: [{
          id: 11,
          label: 'Service ports',
          sclass: 'ali-icon-zuzhixiaxia',
          disable: true,
          add: true,
          children: [{
            id: 111,
            label: 'port1',
            sclass: 'ali-icon-tubiao-qiapian',
            disable: false,
            add: false,
          }]
        }]
      },
        {
          id: 2,
          label: 'Deployment',
          sclass: 'ali-icon-zuzhixiaxia',
          disable: true,
          add: false,
          children: [{
            id: 21,
            label: 'Contaniners',
            sclass: 'ali-icon-zuzhixiaxia',
            disable: true,
            add: true,
            children: [
              {
                id: 211,
                label: 'container1',
                sclass: 'ali-icon-zuzhixiaxia',
                disable: true,
                add: false,
                children: [
                  {
                    id: 2111,
                    label: 'Command',
                    sclass: 'ali-icon-tubiao-qiapian',
                    disable: false,
                    add: false,
                  },
                  {
                    id: 2112,
                    label: 'args',
                    sclass: 'ali-icon-tubiao-qiapian',
                    disable: false,
                    add: false,
                  },
                  {
                    id: 2113,
                    label: 'ports',
                    sclass: 'ali-icon-zuzhixiaxia',
                    disable: true,
                    add: true,
                    children: [{
                      id: 21131,
                      label: 'port1',
                      sclass: 'ali-icon-tubiao-qiapian',
                      disable: false,
                      add: false,
                    }]
                  },
                  {
                    id: 2114,
                    label: 'volumeMounts',
                    sclass: 'ali-icon-zuzhixiaxia',
                    disable: true,
                    add: true,
                    children: [{
                      id: 21141,
                      label: 'Mount1',
                      sclass: 'ali-icon-tubiao-qiapian',
                      disable: false,
                      add: false,
                    }]
                  }
                ]
              }//container
            ]//containers
          },
            {
              id: 22,
              label: 'volumes',
              sclass: 'ali-icon-zuzhixiaxia',
              disable: true,
              add: true,
              children: [{
                id: 221,
                label: 'nfs1',
                sclass: 'ali-icon-tubiao-qiapian',
                disable: false,
                add: false,
              }]
            }//volumes
          ]
        },//deployment
      ];

      return {
        projectId: 0,

        dataTree: JSON.parse(JSON.stringify(data)),
      }
    }

  }
</script>


