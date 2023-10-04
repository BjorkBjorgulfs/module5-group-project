'use client'; //this is a very dinamic component
import { Guide as G, GuideType } from "@/models/guide";
import { FilledButton } from "@/components/buttons/filledButton";
import {
  Guide,
  GuideParagraph,
  Layout,
  GuideSubtitle,
  MainInfoWrapper,
  SideOnfoWrapper,
  SideFrame,
  MaterialLinks,
  RequirementsWrapper,
  UpperWrapper,
  KnowledgeWrapper,
  SkillsWrapper,
  KnowledgeAndSkillsWrapper,
} from "@/styles/pageStyles/guide.styles";
import { MouseEventHandler, use } from "react";
import { useState, useEffect } from "react";
import { MidInput, ShortInput } from "@/components/inputs";
import MarkdownEditor from "@/components/markdownEditor/markdownEditor";

const CreateGuide = ({ params }: { params: { id: string } } ) => {
 
  const [materials, setMaterials] = useState([{title:"edit materials", link:"edit link"}]);
  const [knowledge, setKnowledge] = useState([{knowledge:"edit knowledge"}]);
  const [skills, setSkills] = useState([{skill:"edit skill"}]);
  //const data = JSON.parse(searchParams.data.toString());
  //console.log(data);
  //need to ignore ts errors because of the Mongoose specific types. We could maybe create a custom type for this
  const [guide, setGuide] = useState<Partial<GuideType>>({
    title: "Guide Title",
    description: "edit description",
    category: "edit category",
    // @ts-ignore
    references: [{name:"edit reference", link:"edit link", type:"edit type"}],
    themeIdea: {
      title: "Example Title",
      description: "edit theme idea description",
    },
    // @ts-ignore
    resources: [{description:"this is not used", link:"edit link"}],
    createdAt: new Date(),
    updatedAt: new Date(),
    topicsList: "edit topicList",
    module: {title:"edit module"},
    // @ts-ignore
    classes: materials,
    // @ts-ignore
    knowledge: knowledge,
    // @ts-ignore
    skills: skills,
  });
  console.log(params.id)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  useEffect(() => {
    if (isSubmitting) {
      const createGuide =  () => {
        console.log("creating guide")
        for (const key in guide) {
          //if the value starts with "edit"
          // @ts-ignore
          if (guide[key] && guide[key].toString().startsWith("edit")) {
            alert(`please fill in the ${key} field`);
            setIsSubmitting(false);
            return;
          }
        }
        
        const g = fetch("/api/guides", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            },
          body: JSON.stringify(guide),
        }).then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
      };
      createGuide();
    }
  },[isSubmitting]);
  
  useEffect(() => {
    const getGuide = async () => {
      const res = await fetch(`/api/guides/${params.id}`);
      const data = await res.json();
      console.log("params.id",params.id)
      console.log("data is",data)
      setGuide(data);
    };
    if(params.id !== "new") getGuide();

  }, [params.id]);

  const handleInput = (e:React.SyntheticEvent) => {
    const {dataset, textContent} = e.target as HTMLElement;
    const {name, object, arrayIndex} = dataset;
    //the ts ignoring should be fixed when we make the client specific types
    if(arrayIndex){
      // @ts-ignore
      const arr = guide[object] 
      // @ts-ignore
      const index = parseInt(arrayIndex);
      // @ts-ignore
      arr[index] = {...arr[index], [name]:textContent};
      // @ts-ignore
      setGuide({...guide, [object]:arr});
      return;
    }
    if(object){
      // @ts-ignore
      setGuide({...guide, [object]:{...guide[object], [name]:textContent}});
      return;
    }

    // @ts-ignore
    setGuide({...guide, [name]:textContent});
  }


  const submit: MouseEventHandler<HTMLButtonElement> = (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
  };
  console.log(guide.description);
  return (
    <>
      <Layout>
        <Guide>
          <UpperWrapper>
          <MainInfoWrapper>
            <ShortInput data-name="title" onBlur={handleInput} placeholder={guide.title} />
            <GuideSubtitle>Description</GuideSubtitle>
            <MarkdownEditor  value={guide.description!} data-name="description"/>
            <GuideParagraph data-name="category" onBlur={handleInput} suppressContentEditableWarning={true} contentEditable={true}>
              {guide.category}
            </GuideParagraph>
            <GuideSubtitle>Example</GuideSubtitle>
            <ShortInput data-object="themeIdea" data-name="title" onBlur={handleInput} placeholder={guide.themeIdea?.title}/>
            <MarkdownEditor value={guide.themeIdea?.description!} data-object="themeIdea" data-name="description"></MarkdownEditor>
          </MainInfoWrapper>

          <SideOnfoWrapper>
            <SideFrame>
              <GuideSubtitle>Materials</GuideSubtitle>
              {materials?.map((material, i) => {
                return (
                  <div key={material.title}>
                    <MaterialLinks data-object="classes" data-array-index={i} data-name="title" onBlur={handleInput} suppressContentEditableWarning={true} contentEditable={true} href="#">
                      {material.title}
                    </MaterialLinks><div data-object="classes" data-array-index={i} data-name="link" onBlur={handleInput} suppressContentEditableWarning={true} contentEditable={true}>{material.link}</div>
                    <button onClick={()=>setMaterials([...materials,{title:"edit material", link:"edit link"}])}>add material</button>

                  </div>
                );
              })}
            </SideFrame>
            <SideFrame>
              <GuideSubtitle>Topics</GuideSubtitle>
              <ul>
                  return <li><GuideParagraph data-name="topicsList" onBlur={handleInput} suppressContentEditableWarning={true} contentEditable={true}>{guide.topicsList}</GuideParagraph></li>;
              </ul>
            </SideFrame>
            <SideFrame>
              <GuideSubtitle>Tips</GuideSubtitle>
              <GuideParagraph>
                If you get stuck you can always contact us on Slack and we will
                reply to you as soon as we can. You can also ask us to do a
                “huddle” (a video call on Slack) with you and then we will find
                a time to do that.
              </GuideParagraph>
            </SideFrame>
          </SideOnfoWrapper>
          </UpperWrapper>
          <RequirementsWrapper>
          <GuideSubtitle>Requirements</GuideSubtitle>
          <KnowledgeAndSkillsWrapper>
          <KnowledgeWrapper>
          <GuideParagraph>Knoweldge</GuideParagraph>
          <ul>
            {knowledge?.map((k, i) => {
              return ( 
                <li key={i}>
                  <GuideParagraph 
                    data-object="knowledge" 
                    data-array-index={i} 
                    data-name="knowledge" 
                    onBlur={handleInput} 
                    suppressContentEditableWarning={true}
                    contentEditable={true}
                  >
                    {k.knowledge}
                  </GuideParagraph>
                </li>
              );
            })}
          </ul>
          <button onClick={
            // @ts-ignore
            ()=>setKnowledge([...knowledge,{knowledge:"edit knowledge"}])
          }>add knowledge</button>
          </KnowledgeWrapper>
          <SkillsWrapper>
          <GuideParagraph>Skills</GuideParagraph>
          <ul>
            {skills.map((skill, i) => {
              return (
                <li key={i}>
                  <GuideParagraph 
                    data-object="skills" 
                    data-array-index={i} 
                    data-name="skill" 
                    onBlur={handleInput} 
                    suppressContentEditableWarning={true}
                    contentEditable={true}
                  >
                    {skill.skill}
                  </GuideParagraph>
                </li>
              );
            })}
          </ul><button onClick={()=>setSkills([...skills,{skill:"edit skill"}])}>add skill</button>
          </SkillsWrapper>
          </KnowledgeAndSkillsWrapper>
          </RequirementsWrapper>

          <div style={{display:"flex", width:"100%", justifyContent:"center", marginTop:"3rem"}}>
            <FilledButton onClick={submit}>CREATE</FilledButton>
          </div>
        </Guide>
        
      </Layout>
      
    </>
  );
};

export default CreateGuide;