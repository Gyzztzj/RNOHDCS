import { Tester, Filter, TestSuite } from '@rnoh/testerino';
import {Button, TestCase} from './components';
import React, { useState,useEffect } from 'react';
import {
  ScrollView, StyleSheet, View, Text,Alert, FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import performance,{PerformanceObserver,setResourceLoggingEnabled} from '@react-native-oh-tpl/react-native-performance'
export function TestNativePerformanceDemo({ filter }: { filter: Filter }) {
  const scrollRef = React.useRef<ScrollView>(null);
  const [result1, setResult1] = React.useState(0)
  const [result01, setResult01] = React.useState(0)
  const [result11, setResult11] = React.useState(0)
  const [result2, setResult2] = React.useState('')
  const [result3, setResult3] = React.useState('')
  const [result4, setResult4] = React.useState('')
  const [result5, setResult5] = React.useState('')
  const [result6, setResult6] = React.useState('')
  const [result7, setResult7] = React.useState('')
  const [result7r, setResult7r] = React.useState(999)
  const [result8, setResult8] = React.useState('')
  const [result8r, setResult8r] = React.useState(999)
  return (
    <Tester style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
        <TestSuite name="React Native Performance">
            <TestCase.Logical
              itShould="Convert a performance timestamp：测试timeOrigin属性及转换后的unix epoch时间戳"
              fn={({expect}) => {
                performance.mark('entry');
                let entry=performance.getEntriesByName('entry')[0];
                let timeOrigin=performance.timeOrigin;
                const timestamp = Date.now() - timeOrigin + entry.startTime;
                setResult01(timeOrigin)
                setResult1(timestamp)
                expect(timestamp).to.be.a('number');
              }}
            />
            <TestCase.Example itShould="display timestamp：展示timeOrigin以及转换后的unix epoch时间戳">
            <Text>{`timeOrigin属性值：${JSON.stringify(result01)}`}</Text>
            <Text>{`转换后的unix epoch时间戳:${JSON.stringify(result1)}`}</Text>
          </TestCase.Example>
          <TestCase.Logical
              itShould="now timestamp：测试now方法"
              fn={({expect}) => {
                const timestamp = performance.now()
                setResult11(timestamp)
                expect(timestamp).to.be.a('number');
              }}
            />
            <TestCase.Example itShould="display timestamp：展示now()方法的返回值">
            <Text>{JSON.stringify(result11)}</Text>
          </TestCase.Example>
          <TestCase.Manual
            itShould="Basic measure example：测试mark（'myMark'）及measure('myMeasure2', 'myMark')方法"
            initialState={false}
            arrange={({setState}) => (
              <Button
                label="measure your mark"
                onPress={() => {
                  performance.mark('myMark');
                  performance.measure('myMeasure2', 'myMark');
                  let ms=performance.getEntriesByName('myMeasure2');
                  setResult2(JSON.stringify(ms[0]))
                  setState(ms[0]);
                }}
              />
            )}
            assert={async ({expect,state}) => {
              expect(state).to.have.property('name', 'myMeasure2');
              expect(state).to.contains.all.keys('name','entryType','startTime','duration');
            }}
          />
          <TestCase.Example itShould="display measure：展示measure('myMeasure2', 'myMark')方法返回值">
          <Text>{result2}</Text>
          </TestCase.Example>
          <TestCase.Manual
            itShould="Meta data"
            initialState={false}
            arrange={({setState}) => (
              <Button
                label="measure your Meta data Mark:测试mark('myMark')方法detail:{screen: 'settings'}及measure('myMeasure3')方法detail:{category: 'render'}附加信息以及getEntriesByName方法"
                onPress={() => {
                  performance.mark('myMark', {
                    detail: {
                      screen: 'settings'
                    }
                  });
                  performance.measure('myMeasure3', {
                    start: 'myMark',
                    detail: {
                      category: 'render'
                    }
                  });
                  let ms=performance.getEntriesByName('myMeasure3');
                  // -> [{ name: "myMeasure3", entryType: "measure", startTime: 98, duration: 123, detail: {category: 'render'} }]
                  setResult3(JSON.stringify(ms[0]))
                  setState(ms[0]);
                }}
              />
            )}
            assert={async ({expect,state}) => {
              expect(state).to.have.property('name', 'myMeasure3');
              expect(state).to.have.property('detail');
              expect(state.detail).to.have.property('category','render');
              expect(state).to.contains.all.keys('name','entryType','startTime','duration','detail');
            }}
          />
          <TestCase.Example itShould="display measure attached meta data:展示measure('myMeasure3')方法detail:{category: 'render'}附加信息">
            <Text>{result3}</Text>
          </TestCase.Example>
          <TestCase.Manual
            itShould="Subscribing to entries"
            initialState={false}
            arrange={({setState}) => (
              <Button
                label="subscribing to entries：测试PerformanceObserver对象的observe({ type: 'measure', buffered: true })方法以及Performance对象的getEntries方法"
                onPress={() => {
                  performance.mark('newTimeMark')
                  performance.measure('newTime','newTimeMark')
                  const measureObserver = new PerformanceObserver((list, observer) => {
                    let res=[];
                    list.getEntries().forEach((entry) => {
                      res.push(entry);
                    });
                    setResult4(JSON.stringify(res[0]))
                    setState(res[0]);
                  });
                  measureObserver.observe({ type: 'measure', buffered: true });
                }}
              />
            )}
            assert={async ({expect,state}) => {
              expect(state).to.have.property('name');
              expect(state).to.contains.all.keys('name','entryType','startTime','duration');
            }}
          />
          <TestCase.Example itShould="display subscribed measure：展示PerformanceObserver对象的observe方法监测到的performance Entry">
            <Text>{result4}</Text>
          </TestCase.Example>
          <TestCase.Manual
            itShould="Network resources"
            initialState={false}
            arrange={({setState}) => (
              <Button
                label="test network resources：测试setResourceLoggingEnabled API及getEntriesByType方法"
                onPress={async () => {
                  setResourceLoggingEnabled(true);
                  await fetch('https://www.baidu.com');
                  let res=performance.getEntriesByType('resource');
                  setResult5(JSON.stringify(res[0]))
                  setState(res[0]);
                }}
              />
            )}
            assert={async ({expect,state}) => {
              expect(state).to.have.property('name','https://www.baidu.com');
              expect(state).to.have.property('initiatorType','xmlhttprequest');
              expect(state).to.contains.all.keys('name','entryType','startTime','duration');
            }}
          />
          <TestCase.Example itShould="display network resources">
            <Text>{result5}</Text>
          </TestCase.Example> 
          <TestCase.Manual
            itShould="Custom metrics:测试metric('myMetric', 123)以及getEntriesByType('metric')方法"
            initialState={false}
            arrange={({setState}) => (
              <Button
                label="test custom metrics"
                onPress={async () => {
                  performance.metric('myMetric', 123);
                  let res=performance.getEntriesByType('metric');
                  setResult6(JSON.stringify(res[0]))
                  setState(res[0]);
                  // -> [{ name: "myMetric", entryType: "metric", startTime: 98, duration: 0, value: 123 }]
                }}
              />
            )}
            assert={async ({expect,state}) => {
              expect(state).to.have.property('name','myMetric');
              expect(state).to.have.property('value',123);
              expect(state).to.contains.all.keys('name','entryType','startTime','duration','value');
            }}
          />
          <TestCase.Example itShould="display custom metrics：展示metric('myMetric', 123)以及getEntriesByType('metric')方法返回值">
            <Text>{result6}</Text>
          </TestCase.Example>
          <TestCase.Manual
            itShould="Clear Marks"
            initialState={false}
            arrange={({setState}) => (
              <Button
                label="Test Clear Marks"
                onPress={async () => {
                  performance.mark('myMetric333');
                  let res1=performance.getEntriesByType('mark');
                  setResult7(JSON.stringify(res1));
                  performance.clearMarks();
                  let res2=performance.getEntriesByType('mark');
                  setResult7r(res2.length);
                  setState(res2);
                }}
              />
            )}
            assert={async ({expect,state}) => {
              expect(state).to.be.have.lengthOf(0)
            }}
          />
          <TestCase.Example itShould="display clear marks">
            <Text>展示之前的marks{result7}</Text>
            <Text>展示clear之后的marks.length(default value:999){result7r}</Text>
          </TestCase.Example>
          <TestCase.Manual
            itShould="Clear Measures"
            initialState={false}
            arrange={({setState}) => (
              <Button
                label="Test Clear Measures"
                onPress={async () => {
                  performance.mark('myMark666');
                  performance.measure('myMeasure666', 'myMark666');
                  let res1=performance.getEntriesByType('measure');
                  setResult8(JSON.stringify(res1));
                  performance.clearMeasures();
                  let res2=performance.getEntriesByType('measure');
                  setResult8r(res2.length);
                  setState(res2);
                }}
              />
            )}
            assert={async ({expect,state}) => {
              expect(state).to.be.have.lengthOf(0)
            }}
          />
          <TestCase.Example itShould="display clear measures">
            <Text>展示之前的measures{result8}</Text>
            <Text>展示clear之后的measures.length(default value:999){result8r}</Text>
          </TestCase.Example>
          <View style={styles.buttomMargin}></View>
          </TestSuite>
        </ScrollView>
    </Tester>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333'
  },
  fontstyle: {
    fontSize: 32,
    fontWeight: 600
  },
  caseStyle:{
    width:'100%',
    height:50,
    lineHeight:50,
    marginBottom:20
  },
  buttomMargin:{
    width:'100%',
    height:60
  }
});
